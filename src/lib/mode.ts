/**
 * Recruiter mode: a condensed, skimmable view of the same content.
 *
 * The mode lives on <html data-mode="recruiter">. CSS shows `.recruiter-only`
 * blocks and hides `.story-only` blocks. It can be turned on by the header
 * switch, or by a shareable link ending in `?mode=recruiter`. The choice is
 * remembered in localStorage when the browser allows it.
 */
export type Mode = "story" | "recruiter";

export const MODE_STORAGE_KEY = "ks-portfolio-mode";

/**
 * Runs in <head> before first paint so a recruiter link never flashes the
 * full story view. It also marks <html class="js"> so the hero scroll scene
 * only grows tall when JavaScript is there to animate it. Kept tiny and
 * dependency-free; any failure (private mode, blocked storage) simply leaves
 * the default story view.
 */
export const modeBootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var q=new URLSearchParams(location.search).get('mode');var m=null;if(q==='recruiter'||q==='story'){m=q;try{localStorage.setItem('${MODE_STORAGE_KEY}',q)}catch(e){}}else{try{m=localStorage.getItem('${MODE_STORAGE_KEY}')}catch(e){}}if(m==='recruiter'){d.dataset.mode='recruiter'}}catch(e){}})();`;

export function readMode(): Mode {
  if (typeof document === "undefined") return "story";
  return document.documentElement.dataset.mode === "recruiter" ? "recruiter" : "story";
}

export function writeMode(mode: Mode) {
  const root = document.documentElement;
  if (mode === "recruiter") root.dataset.mode = "recruiter";
  else delete root.dataset.mode;
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // Storage can be unavailable; the mode still applies for this visit.
  }
  // Keep the address bar shareable: ?mode=recruiter when on, clean URL when off.
  try {
    const url = new URL(window.location.href);
    if (mode === "recruiter") url.searchParams.set("mode", "recruiter");
    else url.searchParams.delete("mode");
    window.history.replaceState(window.history.state, "", url);
  } catch {
    // Ignore URL update failures.
  }
}

/** Subscribe to mode changes made anywhere on the page (all switches stay in sync). */
export function subscribeMode(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
  return () => observer.disconnect();
}
