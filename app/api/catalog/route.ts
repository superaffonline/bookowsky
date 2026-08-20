import { NextResponse } from "next/server";
import { bookService } from "@/lib/books/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const result = await bookService.search({
      search: searchParams.get("search") || undefined,
      language: searchParams.get("language") || undefined,
      topic: searchParams.get("topic") || undefined,
      page: Number(searchParams.get("page") || 1),
    });
    return NextResponse.json(result, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
  } catch {
    return NextResponse.json({ error: "Catalog temporarily unavailable" }, { status: 502 });
  }
}
