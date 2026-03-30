"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SearchRecord } from "@/content/types";
import { useRecentViews } from "@/hooks/use-recent-views";
import { categoryConfig } from "@/lib/site-config";

type SearchLauncherProps = {
  searchIndex: SearchRecord[];
};

export function SearchLauncher({ searchIndex }: SearchLauncherProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { recentViews } = useRecentViews();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return searchIndex.slice(0, 8);
    }

    return searchIndex
      .filter((item) => {
        const haystack = [
          item.title,
          item.summary,
          item.category,
          item.tags.join(" "),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalized);
      })
      .slice(0, 12);
  }, [query, searchIndex]);

  return (
    <>
      <button type="button" className="ghost-button" onClick={() => setOpen(true)}>
        搜索内容
        <span className="eyebrow">Ctrl/Cmd + K</span>
      </button>

      {open ? (
        <div className="search-overlay" role="dialog" aria-modal="true">
          <div className="search-panel">
            <div className="hero-actions">
              <label className="sr-only" htmlFor="site-search">
                搜索内容
              </label>
              <input
                id="site-search"
                className="search-input"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索术语、技术专题、项目类型或场景题"
              />
              <button type="button" className="ghost-button" onClick={() => setOpen(false)}>
                关闭
              </button>
            </div>

            <div className="search-results">
              {!query.trim() && recentViews.length ? (
                <>
                  <p className="eyebrow">最近浏览</p>
                  {recentViews.slice(0, 4).map((item) => (
                    <Link
                      key={`recent-${item.category}-${item.slug}`}
                      href={`/${item.category}/${item.slug}`}
                      className="search-result"
                      onClick={() => setOpen(false)}
                    >
                      <strong>{item.title}</strong>
                      <p>{item.summary}</p>
                      <span className="eyebrow">最近浏览</span>
                    </Link>
                  ))}
                </>
              ) : null}
              {results.map((item) => (
                <Link
                  key={`${item.category}-${item.slug}`}
                  href={`/${item.category}/${item.slug}`}
                  className="search-result"
                  onClick={() => setOpen(false)}
                >
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                  <span className="eyebrow">
                    {categoryConfig[item.category].navLabel} / 权重 {item.interviewWeight}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
