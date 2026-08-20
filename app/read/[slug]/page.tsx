import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReaderClient } from "@/components/reader-client";
import { bookService } from "@/lib/books/service";

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = await bookService.getBySlug(slug);
  if (!book) return {};
  return { title: `Read ${book.title}`, description: `Read ${book.title} by ${book.author} online for free.`, robots: { index: false, follow: true } };
}

export default async function ReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await bookService.getBySlug(slug);
  if (!book) notFound();
  return <ReaderClient book={book} />;
}
