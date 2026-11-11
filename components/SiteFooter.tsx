import Image from "next/image";

// One footer for the whole site (landing, Terms, Privacy, Account deletion, Claim).
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="site-footer-brand" href="/" aria-label="SporkIt home">
        <Image src="/landing/fork-mark.svg" alt="" width={28} height={28} loading="eager" />
        <span className="site-footer-word">
          Spork<span className="brand">It</span>
        </span>
      </a>
      <p className="site-footer-copy">© 2026 SporkIt. All rights reserved.</p>
      <nav className="site-footer-links" aria-label="Footer">
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy</a>
        <a href="/delete-account">Account deletion</a>
        <a href="mailto:contact@sporkitapp.com">Contact</a>
      </nav>
      <a
        className="site-footer-tiktok"
        href="https://www.tiktok.com/@spork.it"
        aria-label="SporkIt on TikTok"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src="/landing/tiktok.svg" alt="" width={24} height={24} loading="eager" />
      </a>
    </footer>
  );
}
