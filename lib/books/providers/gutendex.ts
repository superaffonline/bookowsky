import type { Book, BookAccent, CatalogResponse } from "@/lib/books";
import { languageName } from "@/lib/books";

const API = "https://gutendex.com/books";
const accents: BookAccent[] = ["violet", "orange", "cyan", "pink"];

type GutendexPerson = { name: string; birth_year: number | null; death_year: number | null };
type GutendexBook = {
  id: number;
  title: string;
  authors: GutendexPerson[];
  summaries?: string[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean | null;
  formats: Record<string, string>;
  download_count: number;
};
type GutendexResponse = { count: number; next: string | null; previous: string | null; results: GutendexBook[] };

function pickFormat(formats: Record<string, string>, prefix: string) {
  const exact = Object.entries(formats).find(([type]) => type === prefix)?.[1];
  if (exact) return exact;
  return Object.entries(formats).find(([type]) => type.startsWith(prefix))?.[1];
}

function categoryOf(raw: GutendexBook) {
  const source = raw.bookshelves[0] || raw.subjects[0] || "Literature";
  return source.replace(/^Browsing: /, "").split(" -- ")[0].slice(0, 44);
}

export function normalizeGutendexBook(raw: GutendexBook): Book {
  const author = raw.authors[0];
  const languageCode = raw.languages[0] || "en";
  const epubUrl = pickFormat(raw.formats, "application/epub+zip");
  const htmlUrl = pickFormat(raw.formats, "text/html");
  const coverUrl = raw.formats["image/jpeg"];
  return {
    id: raw.id,
    slug: `gutenberg-${raw.id}`,
    title: raw.title,
    author: author?.name || "Unknown author",
    year: author?.death_year || undefined,
    language: languageName(languageCode),
    languageCode,
    category: categoryOf(raw),
    accent: accents[raw.id % accents.length],
    description: raw.summaries?.[0] || `A free digital edition of ${raw.title} from Project Gutenberg.`,
    rights: raw.copyright === false
      ? "Marked copyright-free in Project Gutenberg metadata. Check local copyright law before reuse outside the USA."
      : "Rights status may vary by jurisdiction. Check the Project Gutenberg source page before reuse.",
    sourceName: "Project Gutenberg",
    coverUrl,
    epubUrl,
    htmlUrl,
    downloadCount: raw.download_count,
    provider: "gutenberg",
  };
}

function pageFromUrl(url: string | null) {
  if (!url) return null;
  const value = new URL(url).searchParams.get("page");
  return value ? Number(value) : 1;
}

export async function searchGutenbergBooks(input: {
  search?: string;
  language?: string;
  topic?: string;
  page?: number;
} = {}): Promise<CatalogResponse> {
  const url = new URL(API);
  if (input.search) url.searchParams.set("search", input.search);
  if (input.language && input.language !== "all") url.searchParams.set("languages", input.language);
  if (input.topic && input.topic !== "all") url.searchParams.set("topic", input.topic);
  if (input.page && input.page > 1) url.searchParams.set("page", String(input.page));
  url.searchParams.set("sort", "popular");

  const response = await fetch(url, {
    headers: { "User-Agent": "BOOKOWSKY/0.4 (+https://bookowsky.org)" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Gutendex returned ${response.status}`);
  const data = (await response.json()) as GutendexResponse;
  return {
    count: data.count,
    nextPage: pageFromUrl(data.next),
    previousPage: pageFromUrl(data.previous),
    books: data.results.map(normalizeGutendexBook),
  };
}

export async function getGutenbergBook(id: number): Promise<Book | null> {
  const response = await fetch(`${API}/${id}`, {
    headers: { "User-Agent": "BOOKOWSKY/0.4 (+https://bookowsky.org)" },
    next: { revalidate: 86400 },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Gutendex returned ${response.status}`);
  return normalizeGutendexBook((await response.json()) as GutendexBook);
}
