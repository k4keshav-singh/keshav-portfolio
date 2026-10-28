import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="pt-40 pb-28">
      <p className="font-mono text-sm text-faint">404</p>
      <h1 className="font-display mt-3 text-5xl">This page doesn&apos;t exist.</h1>
      <p className="mt-3 text-muted">The link may be old, or the address may have a typo.</p>
      <Link href="/" className="text-link mt-6 inline-block">
        Back to the home page
      </Link>
    </Container>
  );
}
