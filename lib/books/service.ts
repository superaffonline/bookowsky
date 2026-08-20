import { createClient } from "@/lib/supabase/server";
import { getBookIdFromSlug, languageName, type Book, type CatalogResponse } from "@/lib/books";

function mapRowToBook(row: any): Book {
  const firstAuthor = Array.isArray(row.authors) ? row.authors[0] : null;
  const languageCode = row.languages?.[0] ?? "en";

  return {
    id: Number(row.provider_id),
    slug: row.slug,
    title: row.title,
    author: firstAuthor?.name ?? "Unknown author",
    year: firstAuthor?.death_year ?? undefined,
    language: languageName(languageCode),
    languageCode,
    category: row.subjects?.[0] ?? "Literature",
    accent: "violet",
    description: row.description ?? `A free digital edition of ${row.title}.`,
    rights: row.copyright_free
      ? "Marked copyright-free in Project Gutenberg metadata. Check local copyright law before reuse outside the USA."
      : "Rights status may vary by jurisdiction.",
    sourceName: "Project Gutenberg",
    coverUrl: row.cover_url ?? undefined,
    epubUrl: row.epub_url ?? undefined,
    htmlUrl: row.html_url ?? undefined,
    downloadCount: row.download_count ?? 0,
    provider: "gutenberg",
  };
}

export const bookService = {
  async search(input: {
    search?: string;
    language?: string;
    topic?: string;
    page?: number;
  } = {}): Promise<CatalogResponse> {
    const supabase = await createClient();

    const page = Math.max(input.page ?? 1, 1);
    const pageSize = 24;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("books")
      .select("*", { count: "exact" })
      .order("download_count", { ascending: false });

    if (input.search) {
      query = query.ilike("title", `%${input.search}%`);
    }

    if (input.language && input.language !== "all") {
      query = query.contains("languages", [input.language]);
    }

    if (input.topic && input.topic !== "all") {
      query = query.contains("subjects", [input.topic]);
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      throw error;
    }

    const total = count ?? 0;
    const hasNext = to + 1 < total;

    return {
      count: total,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: hasNext ? page + 1 : null,
      books: (data ?? []).map(mapRowToBook),
    };
  },

  async getBySlug(slug: string): Promise<Book | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return mapRowToBook(data);
    }

    const legacyId = getBookIdFromSlug(slug);

    if (!legacyId) {
      return null;
    }

    const { data: legacyBook } = await supabase
      .from("books")
      .select("*")
      .eq("provider_id", String(legacyId))
      .maybeSingle();

    return legacyBook ? mapRowToBook(legacyBook) : null;
  },
};