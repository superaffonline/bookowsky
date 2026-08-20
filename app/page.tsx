import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronRight,
  Eye,
  Feather,
  Globe2,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { bookService } from "@/lib/books/service";
import { BookCard } from "@/components/book-card";
import { Logo } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: brand.name,
  url: brand.url,
  description: brand.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${brand.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function Home() {
  let featured;

try {
  featured = await bookService.search({ page: 1 });
} catch (error) {
  console.error("Unable to load featured books", error);

  featured = {
    count: 0,
    nextPage: null,
    previousPage: null,
    books: [],
  };
}
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className="hero" id="top">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="hero-copy">
          <div className="pill"><Sparkles size={14} /> An open experiment in access to knowledge</div>
          <h1>Good books should cost <span className="strike">money.</span> <span className="gradient-text">attention.</span></h1>
          <p className="hero-lead">Read digital books for free. Independent authors get paid. Brands fund the access. You choose when your attention is worth the trade.</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/books">Browse the library <ArrowRight size={17} /></Link>
            <a className="button button-ghost" href="#how">See how it works <ChevronRight size={17} /></a>
          </div>
          <div className="trust-row">
            <span><BadgeCheck size={16} /> Legal-first catalog</span>
            <span><Eye size={16} /> Opt-in sponsorships</span>
            <span><Globe2 size={16} /> Open source</span>
          </div>
        </div>

        <div className="hero-art" aria-label="Sponsored book unlock concept">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="floating-card fc-one"><Zap size={16}/> 60 sec sponsor story</div>
          <div className="floating-card fc-two"><BookOpen size={16}/> EPUB unlocked</div>
          <div className="hero-book">
            <div className="hero-book-spine">BKWSKY / 001</div>
            <div className="hero-book-content">
              <p>THE</p><p className="large">GREAT</p><p className="large">GATSBY</p>
              <span>F. SCOTT FITZGERALD</span>
            </div>
          </div>
          <div className="unlock-card">
            <div className="unlock-top"><span>Sponsored unlock</span><span>01:00</span></div>
            <div className="progress"><span /></div>
            <div className="unlock-bottom"><span className="sponsor-dot" /> Concept sponsor <strong>DEMO</strong></div>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Bookowsky principles">
        <div className="ticker-track">
          {["READ MORE", "PAY LESS", "FUND AUTHORS", "CHOOSE ATTENTION", "OPEN ACCESS", "READ MORE", "PAY LESS", "FUND AUTHORS", "CHOOSE ATTENTION", "OPEN ACCESS"].map((item, i) => <span key={`${item}-${i}`}>{item}<i>✦</i></span>)}
        </div>
      </section>

      <section className="library section" id="library">
        <div className="section-heading">
          <div><p className="eyebrow">THE OPEN SHELF / 001</p><h2>Books worth your time.</h2></div>
          <Link href="/books" className="inline-link">View full library <ArrowRight size={16}/></Link>
        </div>
        <div className="books-grid">{featured.books.slice(0, 4).map((book, index) => <BookCard key={book.id} book={book} index={index} />)}</div>
      </section>

      <section className="how section" id="how">
        <div className="how-intro">
          <p className="eyebrow">THE EXCHANGE</p>
          <h2>Your attention already has value.<br/>Spend it on something worth keeping.</h2>
        </div>
        <div className="steps">
          <article><span>01</span><Eye/><h3>Choose</h3><p>Pick a book and decide whether the sponsor exchange feels worth it.</p></article>
          <article><span>02</span><Zap/><h3>Unlock</h3><p>Watch, learn, answer or try. Every campaign is explicit and opt-in.</p></article>
          <article><span>03</span><BookOpen/><h3>Keep</h3><p>Unlock the authorized digital edition and read it on your preferred device.</p></article>
          <article><span>04</span><Feather/><h3>Fund</h3><p>A share of the campaign value goes back to the author or rights holder.</p></article>
        </div>
      </section>

      <section className="manifesto section" id="manifesto">
        <div className="manifesto-label">A SMALL MANIFESTO</div>
        <blockquote>“The internet made information abundant. Books should not become a luxury just because attention became scarce.”</blockquote>
        <div className="manifesto-bottom">
          <p>BOOKOWSKY is an open-source experiment for a different digital publishing economy — one where readers keep their money, authors still get paid, and brands compete to fund access rather than interrupt it.</p>
          <a className="button button-light" href="https://github.com" target="_blank" rel="noreferrer">Build it with us <ArrowRight size={17}/></a>
        </div>
      </section>

      <section className="cta section">
        <div><p className="eyebrow">EARLY ACCESS</p><h2>The first shelf is opening.</h2><p>Follow the project, contribute code, or be one of the first readers.</p></div>
        <form className="signup-form"><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" required/><button type="submit">Join the experiment <ArrowRight size={16}/></button></form>
      </section>

      <footer>
        <a className="brand" href="#top"><Logo/><span>{brand.name}</span></a>
        <p>Books paid by attention, not by readers.</p>
        <div><a href="#">GitHub</a><a href="#">License</a><a href="#">Privacy</a></div>
      </footer>
    </main>
  );
}
