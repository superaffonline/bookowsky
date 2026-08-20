import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { brand } from "@/lib/brand";
import { Logo } from "@/components/logo";
import { UserNav } from "@/components/user-nav";

export async function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label={`${brand.name} home`}>
        <Logo />
        <span>{brand.name}</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/books">Library</Link>
        <Link href="/#how">How it works</Link>
        <Link href="/#manifesto">Manifesto</Link>
        <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
      <div className="nav-actions">
        <UserNav />
        <Link className="button button-dark button-small" href="/books">
          Explore books <ArrowRight size={15} />
        </Link>
      </div>
      <button className="menu-button" type="button" aria-label="Open navigation"><Menu /></button>
    </header>
  );
}
