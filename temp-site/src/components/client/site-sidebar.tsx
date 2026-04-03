"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { getTopicsByCategory } from "@/content";
import { categoryConfig, orderedCategories } from "@/lib/site-config";
import { readStorage, writeStorage } from "@/lib/client/storage";
import type { TopicCategory } from "@/content/types";

const STORAGE_KEY = "testdev:sidebar-expanded";

type SiteSidebarProps = {
  currentCategory?: TopicCategory;
  currentSlug?: string;
};

export function SiteSidebar({ currentCategory, currentSlug }: SiteSidebarProps) {
  // 初始化：当前分类展开，其他折叠
  const [expanded, setExpanded] = useState<Set<TopicCategory>>(() => {
    // 如果有当前分类，默认展开
    if (currentCategory) {
      return new Set([currentCategory]);
    }
    return new Set();
  });

  // 客户端初始化，恢复存储的展开状态
  useEffect(() => {
    const stored = readStorage<TopicCategory[]>(STORAGE_KEY, []);
    if (stored.length > 0) {
      setExpanded(new Set(stored));
    } else if (currentCategory) {
      // 没有存储状态时，默认展开当前分类
      setExpanded(new Set([currentCategory]));
    }
  }, [currentCategory]);

  const toggleCategory = useCallback((category: TopicCategory) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      writeStorage(STORAGE_KEY, Array.from(next));
      return next;
    });
  }, []);

  return (
    <aside className="site-sidebar">
      {orderedCategories.map((category) => {
        const config = categoryConfig[category];
        const topics = getTopicsByCategory(category);
        const isExpanded = expanded.has(category);
        const isCurrentCategory = category === currentCategory;

        return (
          <section
            key={category}
            className="sidebar-section"
            data-active={isCurrentCategory}
          >
            <button
              type="button"
              className="sidebar-heading-toggle"
              onClick={() => toggleCategory(category)}
              aria-expanded={isExpanded}
            >
              <span className="sidebar-toggle-icon" data-expanded={isExpanded} />
              <Link
                href={config.href}
                className={`sidebar-heading ${isCurrentCategory ? "active" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                {config.navLabel}
              </Link>
            </button>
            <div className={`sidebar-links ${isExpanded ? "" : "collapsed"}`}>
              {topics.slice(0, 6).map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/${topic.category}/${topic.slug}`}
                  className={topic.slug === currentSlug ? "active" : ""}
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </aside>
  );
}