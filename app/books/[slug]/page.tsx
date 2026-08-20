import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getGutenbergEpubUrl, getGutenbergPageUrl } from "@/lib/books";
import { bookService } from "@/lib/books/service";

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = await bookService.getBySlug(slug);
  if (!book) return {};
  return {
    title: `${book.title} by ${book.author}`,
    description: `${book.description} Read online or download the EPUB free from its source.`,
    alternates: { canonical: `/books/${book.slug}` },
    openGraph: { title: book.title, description: book.description, type: "book", images: book.coverUrl ? [book.coverUrl] : undefined },
  };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await bookService.getBySlug(slug);
  if (!book) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    inLanguage: book.languageCode,
    isAccessibleForFree: true,
    image: book.coverUrl,
    url: `/books/${book.slug}`,
  };

  return (
    <main>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="book-detail section">
        <div className="detail-cover-wrap">
          {book.coverUrl ? <div className="book-cover detail-cover remote-cover"><img src={book.coverUrl} alt={`Cover of ${book.title}`} /></div> : <div className={`book-cover detail-cover cover-${book.accent}`}><span className="cover-index">PG / {book.id}</span><div className="cover-type">{book.category}</div><h2>{book.title}</h2><p>{book.author}</p><div className="cover-foot">PROJECT GUTENBERG</div></div>}
        </div>
        <div className="detail-copy">
          <Link className="back-link" href="/books"><ArrowLeft size={15} /> Library</Link>
          <p className="eyebrow">FREE DIGITAL EDITION · PG {book.id}</p>
          <h1>{book.title}</h1>
          <p className="detail-author">{book.author} · {book.language}</p>
          <p className="detail-description">{book.description}</p>
          <div className="detail-actions">
            <Link className="button button-dark" href={`/read/${book.slug}`}><BookOpen size={17} /> Read now <ArrowRight size={16} /></Link>
            <a className="button button-ghost" href={getGutenbergEpubUrl(book)}><Download size={17} /> Download EPUB</a>
          </div>
          <div className="rights-card"><ShieldCheck size={19} /><div><strong>Legal-first access</strong><p>{book.rights}</p></div></div>
          <dl className="book-facts">
            <div><dt>Language</dt><dd>{book.language}</dd></div>
            <div><dt>Downloads</dt><dd>{book.downloadCount?.toLocaleString() || "—"}</dd></div>
            <div><dt>Source</dt><dd><a href={getGutenbergPageUrl(book)} target="_blank" rel="noreferrer">{book.sourceName} <ExternalLink size={12} /></a></dd></div>
          </dl>
          <p className="source-note">Public-domain access stays free. Future sponsored unlocks will be reserved for editions where a sponsor is actually funding access.</p>
        </div>
      </section>
    </main>
  );
}
