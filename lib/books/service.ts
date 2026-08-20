import { getBookIdFromSlug } from "@/lib/books";
import { getGutenbergBook, searchGutenbergBooks } from "@/lib/books/providers/gutendex";

export const bookService = {
  search: searchGutenbergBooks,
  async getBySlug(slug: string) {
    const id = getBookIdFromSlug(slug);
    return id ? getGutenbergBook(id) : null;
  },
};
