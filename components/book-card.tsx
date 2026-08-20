import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Book } from "@/lib/books";

export function BookCard({ book, index = 0 }: { book: Book; index?: number }) {
  return (
    <article className="book-card reveal" style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}>
      <Link href={`/books/${book.slug}`} aria-label={`Open ${book.title}`}>
        {book.coverUrl ? (
          <div className="book-cover remote-cover"><img src={book.coverUrl} alt={`Cover of ${book.title}`} loading="lazy" /></div>
        ) : (
          <div className={`book-cover cover-${book.accent}`}>
            <span className="cover-index">PG / {book.id}</span><div className="cover-type">{book.category}</div><h3>{book.title}</h3><p>{book.author}</p><div className="cover-foot">PUBLIC DOMAIN · PROJECT GUTENBERG</div>
          </div>
        )}
        <div className="book-meta">
          <div><p className="eyebrow">READ + DOWNLOAD FREE</p><h3>{book.title}</h3><p>{book.author}</p></div>
          <span className="icon-button" aria-hidden="true"><ArrowRight size={18} /></span>
        </div>
      </Link>
    </article>
  );
}
