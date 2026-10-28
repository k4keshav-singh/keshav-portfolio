/* eslint-disable @typescript-eslint/no-require-imports -- plain Node script, run outside the app */
// Browser QA used before delivery. Needs: npm i -D playwright axe-core && npx playwright install chromium
// Run against a production server: npm run build && npx next start -p 3100, then: node scripts/qa.cjs
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = 'http://localhost:3100';
const OUT = path.join(__dirname, '..', 'qa-shots'); fs.mkdirSync(OUT, { recursive: true });
const results = [];
const log = (ok, msg) => { results.push(`${ok ? 'PASS' : 'FAIL'} ${msg}`); };

(async () => {
  const browser = await chromium.launch();
  // 1) Responsive: overflow + screenshots
  for (const w of [360, 768, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    for (const route of ['/', '/work/decision-intelligence', '/work/code-agent', '/work/learning-platform', '/work/exam-prep-app']) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      log(o.sw <= o.cw, `no horizontal overflow at ${w}px on ${route} (${o.sw}/${o.cw})`);
      if (route === '/' || route === '/work/decision-intelligence') {
        await page.screenshot({ path: `${OUT}/${route === '/' ? 'home' : 'case'}-${w}.png`, fullPage: true });
      }
    }
    await ctx.close();
  }

  // 2) axe scan on each route (desktop + mobile)
  for (const w of [1440, 360]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    for (const route of ['/', '/work/decision-intelligence', '/work/code-agent', '/work/learning-platform', '/work/does-not-exist']) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.addScriptTag({ content: axeSource });
      const r = await page.evaluate(async () => await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] }));
      const v = r.violations.map(x => `${x.id}(${x.impact}) x${x.nodes.length}: ${x.nodes.slice(0,2).map(n=>n.target.join(' ')).join(' | ')}`);
      log(v.length === 0, `axe ${w}px ${route}: ${v.length ? v.join('; ') : 'no violations'}`);
    }
    await ctx.close();
  }

  // 3) Interactions
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  // headings order
  const hs = await page.$$eval('h1,h2,h3,h4', els => els.filter(e => e.closest('.recruiter-only,.story-only') === null || getComputedStyle(e.closest('.recruiter-only,.story-only')).display !== 'none').map(e => +e.tagName[1]));
  let jumpOk = hs[0] === 1 && hs.every((h, i) => i === 0 || h <= hs[i-1] + 1);
  log(jumpOk && hs.filter(h=>h===1).length===1, `heading order on home (one h1, no skipped levels): ${hs.join(',')}`);

  // skip link
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => document.activeElement.textContent.trim());
  log(first === 'Skip to content', `first Tab focuses skip link ("${first}")`);
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  log(outline !== 'none', `skip link has visible focus outline (${outline})`);

  // nav anchor
  await page.click('nav[aria-label="Primary"] button:has-text("Menu")');
  log(await page.$eval('dialog.shell-panel', d => d.open), `rail Menu opens the side panel`);
  const sel0 = await page.$eval('dialog.shell-panel [role="tab"][aria-selected="true"]', e => e.textContent.trim());
  log(sel0 === 'Work', `panel opens on the Work tab (${sel0})`);
  await page.keyboard.press('ArrowDown');
  const sel1 = await page.$eval('dialog.shell-panel [role="tab"][aria-selected="true"]', e => e.textContent.trim());
  log(sel1 === 'Systems', `ArrowDown moves to the next tab (${sel1})`);
  await page.keyboard.press('Escape');
  log(!(await page.$eval('dialog.shell-panel', d => d.open)), `Escape closes the panel`);
  await page.hover('nav[aria-label="Primary"] ul li:nth-child(2) button'); await page.waitForTimeout(400);
  log(await page.$eval('nav[aria-label="Primary"] ul li:nth-child(2) .rail-tip', e => getComputedStyle(e).opacity === '1'), `rail icon shows its label on hover`);
  await page.click('nav[aria-label="Primary"] ul li:nth-child(2) button');
  await page.click('dialog.shell-panel >> text=Human-in-the-loop coding');
  await page.waitForTimeout(2500);
  const engTop = await page.$eval('#engineering', e => e.getBoundingClientRect().top);
  log(engTop >= 0 && engTop < 200, `nav "Engineering" scrolls to section (top=${Math.round(engTop)})`);

  // walkthrough
  const live = page.locator('[aria-live="polite"][aria-atomic="true"]');
  await page.click('button:has-text("Start")');
  let t = await live.innerText();
  log(/Step 1 of 9/.test(t), `walkthrough Start → step 1 of 9`);
  for (let i = 0; i < 3; i++) await page.click('[aria-label="Walkthrough controls"] button:has-text("Next")');
  t = await live.innerText();
  log(/Step 4 of 9/.test(t), `Next x3 → step 4`);
  await page.click('[aria-label="Walkthrough controls"] button:has-text("Previous")');
  t = await live.innerText();
  log(/Step 3 of 9/.test(t), `Previous → step 3`);
  const cur = await page.$eval('[aria-current="step"]', e => e.textContent);
  log(/Code ∥ Tests/.test(cur), `rail marks current stage with aria-current ("${cur.trim()}")`);
  await page.click('label:has-text("Approval withheld")');
  t = await live.innerText();
  log(/Not started/.test(t), `changing scenario resets to not-started`);
  await page.click('button:has-text("Start")');
  await page.click('[aria-label="Walkthrough controls"] button:has-text("Next")');
  t = await live.innerText();
  log(/rejects/.test(t), `withheld scenario shows rejection of the spec`);
  // go to last step, Next disabled
  for (let i = 0; i < 5; i++) { const b = page.locator('[aria-label="Walkthrough controls"] button:has-text("Next")'); if (await b.isEnabled()) await b.click(); }
  log(await page.locator('[aria-label="Walkthrough controls"] button:has-text("Next")').isDisabled(), `Next disabled on last step`);
  await page.click('[aria-label="Walkthrough controls"] button:has-text("Reset")');
  log(/Not started/.test(await live.innerText()), `Reset returns to not started`);
  // keyboard tabs
  await page.focus('main [role="tab"][aria-selected="true"]');
  await page.keyboard.press('ArrowRight');
  const sel = await page.$eval('main [role="tab"][aria-selected="true"]', e => e.textContent);
  const foc = await page.evaluate(() => document.activeElement.getAttribute('role'));
  log(/Explainable recommendations/.test(sel) && foc === 'tab', `ArrowRight switches tab to "${sel.trim()}" and keeps focus`);
  await page.click('label:has-text("Low confidence")');
  await page.click('button:has-text("Start")');
  for (let i = 0; i < 3; i++) await page.click('[aria-label="Walkthrough controls"] button:has-text("Next")');
  log(/open question/i.test(await live.innerText()), `low-confidence scenario ends as an open question`);
  await page.screenshot({ path: `${OUT}/walkthrough-1280.png`, clip: await page.$eval('#engineering', e => { const r = e.closest('section').getBoundingClientRect(); return { x: 0, y: r.top + window.scrollY, width: 1280, height: Math.min(r.height, 1300) }; }) , fullPage: true});
  // text equivalent
  const detailsItems = await page.$$eval('#engineering ~ * details li, section[aria-labelledby="engineering"] details li', els => els.length);
  log(detailsItems > 0, `text equivalent lists ${detailsItems} steps`);

  // archive cards
  const cards = await page.$$eval('section.ring-section ul > li', els => els.filter(e => e.checkVisibility()).length);
  log(cards === 8, `archive shows ${cards} cards`);
  // sticky CTA bar
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  log(await page.$eval('.cta-bar', e => e.inert && !e.hasAttribute('data-show')), `CTA bar hidden and inert at the top`);
  await page.evaluate(() => window.scrollTo(0, 2500)); await page.waitForTimeout(500);
  log(await page.$eval('.cta-bar', e => !e.inert && e.hasAttribute('data-show')), `CTA bar slides in after the hero`);
  await page.evaluate(() => document.getElementById('contact').scrollIntoView()); await page.waitForTimeout(1800);
  log(await page.$eval('.cta-bar', e => e.inert), `CTA bar hides over the contact section`);

  // copy email
  await page.click('button:has-text("Copy email")');
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  const status = await page.$eval('#contact ~ * [role="status"], section[aria-labelledby="contact"] [role="status"]', e => e.textContent);
  log(clip === 'k4keshav.s4singh@gmail.com' && /copied/i.test(status), `copy email → clipboard "${clip}", status "${status}"`);

  // resume is requested by email, not published
  const pdfLinks = await page.$$eval('a[href$=".pdf"], a[download]', els => els.length);
  log(pdfLinks === 0, `no published PDF / download links (${pdfLinks})`);
  const resumeMentions = await page.$$eval('a', els => els.filter(e => /resume/i.test(e.textContent + e.href)).length);
  log(resumeMentions === 0, `no resume links on the page (${resumeMentions})`);
  const tiles = await page.$$eval('section[aria-labelledby="work"] .work-tile', els => els.map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.top + scrollY), Math.round(r.height)]; }));
  log(tiles.length === 4 && tiles[0][0] === tiles[1][0] && tiles[2][0] === tiles[3][0] && tiles[0][1] === tiles[1][1] && tiles[2][1] === tiles[3][1], `featured work: 4 tiles in aligned rows ${JSON.stringify(tiles)}`);
  const oldPdf = await page.request.get(BASE + '/resume/Keshav_Singh_Resume_AI_FullStack.pdf');
  log(oldPdf.status() === 404, `old resume URL is gone (${oldPdf.status()})`);

  // case study navigation
  await page.click('a[href="/work/code-agent"]:has-text("Discover case")');
  await page.waitForURL('**/work/code-agent');
  const h1 = await page.$eval('h1', e => e.textContent);
  log(h1 === 'Code Agent', `case study link opens /work/code-agent (h1 "${h1}")`);
  const title = await page.title();
  log(/Code Agent/.test(title), `case study title: ${title}`);
  log(await page.$eval('#confidentiality', e => !!e), `case study has a "What I can't share" section`);
  await page.click('a:has-text("Next: Learning Platform")');
  await page.waitForURL('**/work/learning-platform');
  log(true, `next-case-study link works`);

  // mobile menu
  const m = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const mp = await m.newPage();
  await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
  await mp.click('button:has-text("Open menu")');
  await mp.click('dialog.shell-panel button[aria-pressed]:has-text("Contact")');
  await mp.click('dialog.shell-panel >> text=Say hello');
  await mp.waitForTimeout(2000);
  const open = await mp.$eval('dialog.shell-panel', d => d.open);
  const ctop = await mp.$eval('#contact', e => e.getBoundingClientRect().top);
  log(!open && ctop < 200, `mobile menu: link closes menu and scrolls to Contact (top=${Math.round(ctop)})`);
  await mp.screenshot({ path: `${OUT}/home-360-menu.png` });
  // touch target sizes
  const small = await mp.$$eval('a, button, summary', els => els.filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 24 || r.width < 24) && !e.classList.contains('sr-only'); }).map(e => (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0,30)));
  log(small.length === 0, `no interactive target under 24px on mobile${small.length ? ': ' + small.join(' | ') : ''}`);

  // reduced motion + no-JS
  const rm = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
  const rp = await rm.newPage(); await rp.goto(BASE + '/');
  const sb = await rp.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  log(sb === 'auto', `reduced motion: scroll-behavior is ${sb}`);
  const nj = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const np = await nj.newPage(); await np.goto(BASE + '/');
  const txt = await np.evaluate(() => document.body.innerText);
  log(txt.includes('Featured') && txt.includes('Read this scenario as text') && txt.includes('Code Agent'), `content readable with JavaScript disabled`);


  // Recruiter mode
  const rc = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const rp2 = await rc.newPage();
  await rp2.goto(BASE + '/', { waitUntil: 'networkidle' });
  const sw = rp2.locator('aside [role="switch"]:visible').first();
  log((await sw.getAttribute('aria-checked')) === 'false', `recruiter switch starts off`);
  await sw.click();
  await rp2.waitForTimeout(300);
  const vis = async (sel) => rp2.$eval(sel, e => e.checkVisibility()).catch(() => false);
  log(await vis('#recruiter-title') && !(await vis('#hero-title')) && !(await vis('#engineering')), `recruiter on: summary shown, hero + walkthrough hidden`);
  log((await sw.getAttribute('aria-checked')) === 'true' && rp2.url().includes('mode=recruiter'), `switch aria-checked=true and URL is shareable (${rp2.url()})`);
  const railTabs = await rp2.$$eval('nav[aria-label="Primary"] ul > li', lis => lis.filter(li => getComputedStyle(li).display !== 'none').map(li => li.textContent.trim()).join(','));
  log(railTabs === 'Work,About,Contact', `rail shows only Work, About, Contact in recruiter mode (${railTabs})`);
  await rp2.addScriptTag({ content: axeSource });
  const rr = await rp2.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a','wcag2aa','wcag21aa','best-practice'] })).violations.map(v=>v.id));
  log(rr.length === 0, `axe in recruiter mode: ${rr.join(',') || 'no violations'}`);
  const hs2 = await rp2.$$eval('h1,h2,h3', els => els.filter(e => e.offsetParent !== null || getComputedStyle(e).position==='fixed').filter(e=>!e.classList.contains('sr-only')).map(e => +e.tagName[1]));
  log(hs2.filter(h => h === 1).length === 1, `exactly one visible h1 in recruiter mode`);
  await rp2.reload({ waitUntil: 'networkidle' });
  log(await vis('#recruiter-title'), `recruiter mode survives reload`);
  await rp2.screenshot({ path: `${OUT}/recruiter-1280.png`, fullPage: true });
  await rp2.locator('aside [role="switch"]:visible').first().click();
  await rp2.waitForTimeout(300);
  log(!(await vis('#recruiter-title')) && await vis('#hero-title') && !rp2.url().includes('mode='), `recruiter off: story view back, URL clean`);
  const fresh = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const fp = await fresh.newPage();
  await fp.goto(BASE + '/?mode=recruiter', { waitUntil: 'domcontentloaded' });
  log(await fp.$eval('#recruiter-title', e => getComputedStyle(e.closest('section')).display !== 'none'), `shared link /?mode=recruiter opens recruiter view (mobile)`);
  await fp.waitForLoadState('networkidle');
  await fp.screenshot({ path: `${OUT}/recruiter-375.png`, fullPage: true });
  const o2 = await fp.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
  log(o2, `no horizontal overflow in recruiter mode at 375px`);
  await fp.goto(BASE + '/work/learning-platform', { waitUntil: 'networkidle' });
  await fp.locator('header [role="switch"]:visible').first().click(); // currently on → off
  await fp.locator('header [role="switch"]:visible').first().click(); // off → on navigates home
  await fp.waitForURL('**/?mode=recruiter');
  log(true, `turning recruiter mode on from a case study goes to the summary`);

  // Confidentiality sweep: rendered text and client JS must not contain any term
  // from private/sensitive-terms.txt (one per line; kept private on purpose so
  // the list of internal names is never published with this script).
  const termsFile = path.join(__dirname, '..', 'private', 'sensitive-terms.txt');
  if (fs.existsSync(termsFile)) {
    const terms = fs.readFileSync(termsFile, 'utf8').split('\n').map(t => t.trim()).filter(t => t && !t.startsWith('#'));
    const sp = await (await browser.newContext()).newPage();
    const scripts = new Set();
    sp.on('response', r => { if (r.url().includes('/_next/static/') && r.url().endsWith('.js')) scripts.add(r.url()); });
    let corpus = '';
    for (const route of ['/', '/?mode=recruiter', '/work/decision-intelligence', '/work/code-agent', '/work/learning-platform', '/work/exam-prep-app', '/sitemap.xml']) {
      const res = await sp.goto(BASE + route, { waitUntil: 'networkidle' });
      corpus += '\n' + (await res.text());
    }
    for (const u of scripts) corpus += '\n' + (await (await sp.request.get(u)).text());
    // Whole-word match, so e.g. a product name doesn't match "horizontal".
    const esc = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = t => new RegExp(`(^|[^a-z0-9_])${esc(t)}${/[a-z0-9]$/i.test(t) ? '(?![a-z0-9_])' : ''}`, 'i');
    const hits = terms.filter(t => re(t).test(corpus));
    log(hits.length === 0, `confidentiality sweep: ${terms.length} private terms checked in HTML + ${scripts.size} JS files${hits.length ? ' — FOUND: ' + hits.join(', ') : ', none found'}`);
  } else {
    log(false, `confidentiality sweep skipped: private/sensitive-terms.txt not found`);
  }

  await browser.close();
  console.log(results.join('\n'));
  console.log(`\n${results.filter(r=>r.startsWith('FAIL')).length} failed / ${results.length} checks`);
})().catch(e => { console.error(e); console.log(results.join('\n')); process.exit(1); });
