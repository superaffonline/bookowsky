import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { SiteHeader } from "@/components/site-header";
import { bookService } from "@/lib/books/service";

export const metadata: Metadata = {
  title: "Explore free books",
  description: "Discover public-domain ebooks from Project Gutenberg. Read online or download EPUB editions legally.",
  alternates: { canonical: "/books" },
};

export default async function BooksPage() {
  const initialCatalog = await bookService.search({ page: 1 });

  return (
    <main>
      <SiteHeader />
      <section className="catalog-hero section">
        <p className="eyebrow">OPEN CATALOG · LIVE</p>
        <h1>Read something worth keeping.</h1>
        <p>Search thousands of public-domain ebooks. Read in BOOKOWSKY or download the EPUB from its source.</p>
      </section>
      <section className="section catalog-section">
        <CatalogExplorer initialCatalog={initialCatalog} />
      </section>
    </main>
  );
}
