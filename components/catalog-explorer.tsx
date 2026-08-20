"use client";

import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookCard } from "@/components/book-card";
import type { CatalogResponse } from "@/lib/books";

const languages = [
  ["all", "All languages"], ["en", "English"], ["es", "Spanish"], ["it", "Italian"],
  ["fr", "French"], ["de", "German"], ["pt", "Portuguese"],
];

const topics = [
  ["all", "All topics"], ["fiction", "Fiction"], ["adventure", "Adventure"], ["history", "History"],
  ["science", "Science"], ["philosophy", "Philosophy"], ["poetry", "Poetry"], ["children", "Children"],
];

export function CatalogExplorer({ initialCatalog }: { initialCatalog: CatalogResponse }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [topic, setTopic] = useState("all");
  const [page, setPage] = useState(1);
  const [catalog, setCatalog] = useState(initialCatalog);
  const [loading, setLoading] = useState(false);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page) });
      if (query.trim()) params.set("search", query.trim());
      if (language !== "all") params.set("language", language);
      if (topic !== "all") params.set("topic", topic);
      try {
        const response = await fetch(`/api/catalog?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Catalog unavailable");
        setCatalog(await response.json());
      } catch (error) {
        if ((error as Error).name !== "AbortError") console.error(error);
      } finally {
        setLoading(false);
      }
    }, query ? 350 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, language, topic, page]);

  const activeFilters = useMemo(() => query || language !== "all" || topic !== "all", [query, language, topic]);
  const reset = () => { setQuery(""); setLanguage("all"); setTopic("all"); setPage(1); };

  return (
    <div className="catalog-explorer">
      <div className="catalog-controls" aria-label="Book filters">
        <label className="catalog-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search books</span>
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search title or author…" type="search" />
          {query ? <button type="button" onClick={() => { setQuery(""); setPage(1); }} aria-label="Clear search"><X size={15} /></button> : null}
        </label>

        <div className="catalog-filter-row">
          <span className="filter-label"><SlidersHorizontal size={14} /> Language</span>
          <div className="filter-pills" role="group" aria-label="Filter by language">
            {languages.map(([value, label]) => <button key={value} type="button" className={language === value ? "filter-pill is-active" : "filter-pill"} onClick={() => { setLanguage(value); setPage(1); }}>{label}</button>)}
          </div>
        </div>

        <div className="catalog-filter-row">
          <span className="filter-label"><SlidersHorizontal size={14} /> Topic</span>
          <div className="filter-pills" role="group" aria-label="Filter by topic">
            {topics.map(([value, label]) => <button key={value} type="button" className={topic === value ? "filter-pill is-active" : "filter-pill"} onClick={() => { setTopic(value); setPage(1); }}>{label}</button>)}
          </div>
        </div>
      </div>

      <div className="catalog-results-meta" aria-live="polite">
        <p>{loading ? "Loading shelf…" : `${catalog.count.toLocaleString()} books found`}</p>
        {activeFilters ? <button type="button" onClick={reset}>Clear filters</button> : <span>Powered by Project Gutenberg metadata</span>}
      </div>

      <div className={loading ? "books-grid is-loading" : "books-grid"}>
        {catalog.books.map((book, index) => <BookCard key={book.id} book={book} index={index} />)}
      </div>

      {!catalog.books.length && !loading ? <div className="empty-catalog"><span>0 results</span><h2>Nothing on this shelf.</h2><p>Try another author, title, language or topic.</p><button className="button button-dark" type="button" onClick={reset}>Reset library</button></div> : null}

      <nav className="catalog-pagination" aria-label="Catalog pagination">
        <button type="button" disabled={!catalog.previousPage || loading} onClick={() => setPage(catalog.previousPage || Math.max(1, page - 1))}><ChevronLeft size={16} /> Previous</button>
        <span>Page {page}</span>
        <button type="button" disabled={!catalog.nextPage || loading} onClick={() => setPage(catalog.nextPage || page + 1)}>Next <ChevronRight size={16} /></button>
      </nav>
    </div>
  );
}
