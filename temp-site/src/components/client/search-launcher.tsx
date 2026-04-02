"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ExtendedSearchRecord, SearchMatchSource } from "@/content/types";
import { useRecentViews } from "@/hooks/use-recent-views";
import { useSearchHistory } from "@/hooks/use-search-history";
import { categoryConfig } from "@/lib/site-config";

type SearchLauncherProps = {
  searchIndex: ExtendedSearchRecord[];
};

// 匹配结果类型
type MatchResult = {
  source: SearchMatchSource;
  snippet: string;
};

type SearchResultItem = ExtendedSearchRecord & {
  matches: MatchResult[];
};

// 辅助函数：提取匹配片段
function extractSnippet(text: string, query: string, contextLength = 30): string {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text.slice(0, 50);
  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + query.length + contextLength);
  let snippet = text.slice(start, end);
  // 添加省略号
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return snippet;
}

// 辅助函数：从 sections 提取匹配
function extractSectionMatch(
  sections: ExtendedSearchRecord["sections"],
  query: string
): MatchResult[] {
  if (!sections) return [];

  const matches: MatchResult[] = [];
  const normalized = query.toLowerCase();

  for (const section of sections) {
    // 检查 section 标题
    if (section.title.toLowerCase().includes(normalized)) {
      matches.push({ source: "qa", snippet: extractSnippet(section.title, query) });
    }

    // 对于 qa-list 类型，检查问题和答案
    if (section.kind === "qa-list") {
      for (const item of section.items) {
        if (item.question.toLowerCase().includes(normalized)) {
          matches.push({ source: "qa", snippet: extractSnippet(item.question, query) });
        }
      }
    }

    // 对于 list 类型，检查项目
    if (section.kind === "list") {
      for (const item of section.items) {
        const itemText = typeof item === "string" ? item : "";
        if (itemText.toLowerCase().includes(normalized)) {
          matches.push({ source: "qa", snippet: extractSnippet(itemText, query) });
        }
      }
    }

    // 对于 paragraph 类型，检查内容
    if (section.kind === "paragraph") {
      for (const token of section.content) {
        if (token.type === "text" && token.content.toLowerCase().includes(normalized)) {
          matches.push({ source: "qa", snippet: extractSnippet(token.content, query) });
        }
      }
    }
  }

  return matches;
}

// 高亮函数：在文本中高亮匹配的关键词
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const normalized = query.toLowerCase();
  const index = text.toLowerCase().indexOf(normalized);
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <span className="search-highlight">{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  );
}

export function SearchLauncher({ searchIndex }: SearchLauncherProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { recentViews } = useRecentViews();
  const { history, addSearchHistory } = useSearchHistory();

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
      return searchIndex.slice(0, 8).map((item) => ({ ...item, matches: [] }));
    }

    return searchIndex
      .map((item) => {
        const matches: MatchResult[] = [];

        // 标题匹配
        if (item.title.toLowerCase().includes(normalized)) {
          matches.push({ source: "title", snippet: item.title });
        }

        // 摘要匹配
        if (item.summary.toLowerCase().includes(normalized)) {
          matches.push({ source: "summary", snippet: extractSnippet(item.summary, normalized) });
        }

        // 标签匹配
        for (const tag of item.tags) {
          if (tag.toLowerCase().includes(normalized)) {
            matches.push({ source: "tags", snippet: tag });
          }
        }

        // 定义匹配（GlossaryTerm）
        if (item.definition && item.definition.toLowerCase().includes(normalized)) {
          matches.push({ source: "definition", snippet: extractSnippet(item.definition, normalized) });
        }

        // 简短定义匹配（GlossaryTerm）
        if (item.shortDefinition && item.shortDefinition.toLowerCase().includes(normalized)) {
          matches.push({ source: "definition", snippet: extractSnippet(item.shortDefinition, normalized) });
        }

        // 高频问题匹配（GlossaryTerm）
        if (item.frequentQuestions) {
          for (const q of item.frequentQuestions) {
            if (q.toLowerCase().includes(normalized)) {
              matches.push({ source: "qa", snippet: extractSnippet(q, normalized) });
            }
          }
        }

        // Sections 匹配
        if (item.sections) {
          matches.push(...extractSectionMatch(item.sections, normalized));
        }

        return { ...item, matches };
      })
      .filter((item) => item.matches.length > 0)
      .slice(0, 12);
  }, [query, searchIndex]);

  // 获取最佳匹配片段用于显示
  const getBestSnippet = (item: SearchResultItem): string => {
    if (item.matches.length === 0) return item.summary;
    // 优先显示 title > summary > definition > qa > tags
    const priority: SearchMatchSource[] = ["title", "summary", "definition", "qa", "tags"];
    for (const source of priority) {
      const match = item.matches.find((m) => m.source === source);
      if (match) return match.snippet;
    }
    return item.matches[0].snippet;
  };

  // 获取匹配来源标签
  const getMatchSourceLabel = (source: SearchMatchSource): string => {
    const labels: Record<SearchMatchSource, string> = {
      title: "标题",
      summary: "摘要",
      definition: "定义",
      qa: "问答",
      tags: "标签",
    };
    return labels[source];
  };

  // 记录搜索历史
  useEffect(() => {
    if (query.trim() && results.length > 0) {
      addSearchHistory({
        query: query.trim(),
        timestamp: new Date().toISOString(),
        resultCount: results.length,
      });
    }
  }, [query, results.length, addSearchHistory]);

  return (
    <>
      <button type="button" className="ghost-button search-trigger" onClick={() => setOpen(true)}>
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
              {!query.trim() && history.length > 0 ? (
                <>
                  <p className="eyebrow">搜索历史</p>
                  {history.slice(0, 5).map((item) => (
                    <button
                      key={item.query}
                      type="button"
                      className="search-history-item"
                      onClick={() => setQuery(item.query)}
                    >
                      {item.query}
                      <span className="eyebrow">{item.resultCount} 结果</span>
                    </button>
                  ))}
                </>
              ) : null}
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
              {query.trim() ? (
                results.map((item) => (
                  <Link
                    key={`${item.category}-${item.slug}`}
                    href={`/${item.category}/${item.slug}`}
                    className="search-result"
                    onClick={() => setOpen(false)}
                  >
                    <strong>{highlightText(item.title, query)}</strong>
                    <p>{highlightText(getBestSnippet(item), query)}</p>
                    <span className="eyebrow">
                      {categoryConfig[item.category].navLabel} / 权重 {item.interviewWeight}
                      {item.matches.length > 0 && (
                        <span style={{ marginLeft: "0.5rem", opacity: 0.7 }}>
                          匹配: {getMatchSourceLabel(item.matches[0].source)}
                        </span>
                      )}
                    </span>
                  </Link>
                ))
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
