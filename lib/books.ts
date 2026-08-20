export type BookAccent = "violet" | "orange" | "cyan" | "pink";

export type Book = {
  id: number;
  slug: string;
  title: string;
  author: string;
  year?: number;
  language: string;
  languageCode: string;
  category: string;
  accent: BookAccent;
  description: string;
  rights: string;
  sourceName: string;
  coverUrl?: string;
  epubUrl?: string;
  htmlUrl?: string;
  downloadCount?: number;
  provider: "gutenberg";
};

export type CatalogResponse = {
  count: number;
  nextPage: number | null;
  previousPage: number | null;
  books: Book[];
};

export const featuredBookIds = [84, 11, 174, 1342, 345, 1661, 2701, 5200, 4300, 64317];

const legacySlugs: Record<string, number> = {
  frankenstein: 84,
  "alice-in-wonderland": 11,
  "the-picture-of-dorian-gray": 174,
  "pride-and-prejudice": 1342,
  dracula: 345,
  "the-adventures-of-sherlock-holmes": 1661,
  "moby-dick": 2701,
  metamorphosis: 5200,
  ulysses: 4300,
  "the-great-gatsby": 64317,
};

const languageNames: Record<string, string> = {
  en: "English", es: "Spanish", it: "Italian", fr: "French", de: "German",
  pt: "Portuguese", nl: "Dutch", fi: "Finnish", sv: "Swedish", la: "Latin",
};

export function getBookIdFromSlug(slug: string) {
  if (legacySlugs[slug]) return legacySlugs[slug];
  const match = slug.match(/^gutenberg-(\d+)$/);
  return match ? Number(match[1]) : null;
}

export function getGutenbergPageUrl(book: Book) {
  return `https://www.gutenberg.org/ebooks/${book.id}`;
}

export function getGutenbergReadUrl(book: Book) {
  return book.htmlUrl || `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}-images.html`;
}

export function getGutenbergEpubUrl(book: Book) {
  return book.epubUrl || `https://www.gutenberg.org/ebooks/${book.id}.epub3.images`;
}

export function languageName(code: string) {
  return languageNames[code] || code.toUpperCase();
}
