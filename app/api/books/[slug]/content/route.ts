import { NextResponse } from "next/server";
import { getGutenbergReadUrl } from "@/lib/books";
import { bookService } from "@/lib/books/service";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await bookService.getBySlug(slug);
  if (!book) return new NextResponse("Book not found", { status: 404 });

  try {
    const sourceUrl = getGutenbergReadUrl(book);
    const response = await fetch(sourceUrl, { headers: { "User-Agent": "BOOKOWSKY/0.4 (+https://bookowsky.org)" }, next: { revalidate: 86400 } });
    if (!response.ok) throw new Error(`Gutenberg returned ${response.status}`);
    let html = await response.text();
    const baseHref = new URL(".", sourceUrl).toString();
    const base = `<base href="${baseHref}">`;
    html = /<head[^>]*>/i.test(html) ? html.replace(/<head([^>]*)>/i, `<head$1>${base}`) : `${base}${html}`;
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800", "X-Robots-Tag": "noindex" } });
  } catch {
    return new NextResponse(`<!doctype html><html><body style="font-family:system-ui;padding:40px;line-height:1.6"><h1>Reader temporarily unavailable</h1><p>Open the original Project Gutenberg edition instead.</p><p><a href="${getGutenbergReadUrl(book)}">Read ${book.title}</a></p></body></html>`, { status: 502, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
}
