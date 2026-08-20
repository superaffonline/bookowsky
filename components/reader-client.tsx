"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Download, ExternalLink, LoaderCircle, Minus, Moon, Plus, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Book } from "@/lib/books";
import { getGutenbergEpubUrl, getGutenbergPageUrl } from "@/lib/books";

const MIN_FONT = 90;
const MAX_FONT = 135;

export function ReaderClient({ book }: { book: Book }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollHandlerRef = useRef<(() => void) | null>(null);
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(100);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadStage, setLoadStage] = useState(0);
  const storageKey = `bookowsky:reader:${book.slug}`;

  const applyReaderStyles = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    doc.documentElement.style.fontSize = `${fontSize}%`;
    doc.documentElement.style.background = darkMode ? "#171715" : "#fffdf8";
    doc.body.style.background = darkMode ? "#171715" : "#fffdf8";
    doc.body.style.color = darkMode ? "#e8e2d8" : "#25231f";
    doc.body.style.maxWidth = "760px";
    doc.body.style.margin = "0 auto";
    doc.body.style.padding = "clamp(28px, 7vw, 72px) clamp(20px, 6vw, 64px) 120px";
    doc.body.style.lineHeight = "1.72";

    doc.querySelectorAll("a").forEach((link) => {
      (link as HTMLElement).style.color = darkMode ? "#b8aaff" : "#5c43d7";
    });
  }, [darkMode, fontSize]);

  useEffect(() => {
    if (!isLoading) return;
    const timers = [
      window.setTimeout(() => setLoadStage(1), 700),
      window.setTimeout(() => setLoadStage(2), 1700),
      window.setTimeout(() => setLoadStage(3), 3200),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [isLoading]);

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    const win = iframe?.contentWindow;
    const doc = iframe?.contentDocument;
    if (!win || !doc) return;

    applyReaderStyles();
    window.setTimeout(() => setIsLoading(false), 250);

    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      const parsed = Number(saved);
      if (Number.isFinite(parsed) && parsed > 0) {
        window.requestAnimationFrame(() => {
          const maxScroll = Math.max(0, doc.documentElement.scrollHeight - win.innerHeight);
          win.scrollTo({ top: maxScroll * (parsed / 100), behavior: "auto" });
          setProgress(parsed);
        });
      }
    }

    if (scrollHandlerRef.current) win.removeEventListener("scroll", scrollHandlerRef.current);

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = Math.max(1, doc.documentElement.scrollHeight - win.innerHeight);
        const nextProgress = Math.min(100, Math.max(0, (win.scrollY / maxScroll) * 100));
        setProgress(nextProgress);
        window.localStorage.setItem(storageKey, nextProgress.toFixed(2));
      });
    };

    scrollHandlerRef.current = onScroll;
    win.addEventListener("scroll", onScroll, { passive: true });
  }, [applyReaderStyles, storageKey]);

  useEffect(() => {
    applyReaderStyles();
  }, [applyReaderStyles]);

  useEffect(() => {
    return () => {
      const win = iframeRef.current?.contentWindow;
      if (win && scrollHandlerRef.current) win.removeEventListener("scroll", scrollHandlerRef.current);
    };
  }, []);

  return (
    <main className={darkMode ? "reader-shell reader-dark" : "reader-shell"}>
      <div className="reader-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <header className="reader-bar">
        <div className="reader-left">
          <Link href={`/books/${book.slug}`} className="reader-control"><ArrowLeft size={16} /> Back</Link>
          <div className="reader-title"><strong>{book.title}</strong><span>{book.author}</span></div>
        </div>

        <div className="reader-tools" aria-label="Reading preferences">
          <button
            className="reader-control icon-only-desktop"
            type="button"
            onClick={() => setFontSize((size) => Math.max(MIN_FONT, size - 10))}
            aria-label="Decrease font size"
          >
            <Minus size={15} />
          </button>
          <span className="reader-percent">{fontSize}%</span>
          <button
            className="reader-control icon-only-desktop"
            type="button"
            onClick={() => setFontSize((size) => Math.min(MAX_FONT, size + 10))}
            aria-label="Increase font size"
          >
            <Plus size={15} />
          </button>
          <button className="reader-control" type="button" onClick={() => setDarkMode((value) => !value)}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />} <span>{darkMode ? "Light" : "Dark"}</span>
          </button>
        </div>

        <div className="reader-actions">
          <a className="reader-control" href={getGutenbergEpubUrl(book)}><Download size={16} /> EPUB</a>
          <a className="reader-control" href={getGutenbergPageUrl(book)} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Source</a>
        </div>
      </header>
      <div className="reader-notice">
        <span>{Math.round(progress)}% read</span>
        <span>Progress is saved on this device.</span>
      </div>
      <div className="reader-canvas">
        {isLoading ? (
          <div className="reader-loading" role="status" aria-live="polite">
            <div className="reader-loading-icon">
              <BookOpen size={30} strokeWidth={1.7} />
              <LoaderCircle className="reader-loading-spinner" size={56} strokeWidth={1.2} />
            </div>
            <p className="reader-loading-kicker">PREPARING YOUR BOOK</p>
            <h2>{[
              "Opening the pages…",
              "Setting the type for comfortable reading…",
              "Restoring your reading experience…",
              "Almost there — your book is being rendered…",
            ][loadStage]}</h2>
            <p className="reader-loading-copy">This usually takes only a moment. We’re preparing the edition so it feels great to read in your browser.</p>
            <div className="reader-loading-track" aria-hidden="true"><span /></div>
            <span className="reader-loading-title">{book.title} · {book.author}</span>
          </div>
        ) : null}
        <iframe
          ref={iframeRef}
          onLoad={handleLoad}
          className={isLoading ? "reader-frame reader-frame-loading" : "reader-frame"}
          title={`${book.title} reader`}
          src={`/api/books/${book.slug}/content`}
          sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </main>
  );
}
