"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import type { ContentTopic, TopicCategory } from "@/content/types";
import { DifficultyBadge } from "./difficulty-badge";

type CategoryFilterPanelProps = {
  category: TopicCategory;
  topics: ContentTopic[];
};

export function CategoryFilterPanel({
  category,
  topics,
}: CategoryFilterPanelProps) {
  const searchParams = useSearchParams();
  const initialDifficulty = searchParams.get("difficulty") as "beginner" | "interview" | null;

  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"all" | "beginner" | "interview">(
    initialDifficulty || "all"
  );
  const [weight, setWeight] = useState<"all" | "1" | "2" | "3">("all");
  const [tag, setTag] = useState<string>("all");
  const deferredQuery = useDeferredValue(query);

  // 术语体系不需要筛选维度，只保留搜索
  const isGlossary = category === "glossary";

  const tags = useMemo(
    () => Array.from(new Set(topics.flatMap((topic) => topic.tags))).slice(0, 12),
    [topics],
  );

  const filteredTopics = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    // 术语体系只按搜索词筛选
    if (isGlossary) {
      return topics.filter((topic) =>
        !normalized ||
        `${topic.title} ${topic.summary} ${topic.tags.join(" ")}`.toLowerCase().includes(normalized)
      );
    }

    return topics.filter((topic) => {
      const matchesQuery =
        !normalized ||
        `${topic.title} ${topic.summary} ${topic.tags.join(" ")}`.toLowerCase().includes(normalized);
      const matchesDifficulty =
        difficulty === "all" || topic.difficulty === difficulty;
      const matchesWeight = weight === "all" || topic.interviewWeight === Number(weight);
      const matchesTag = tag === "all" || topic.tags.includes(tag);

      return matchesQuery && matchesDifficulty && matchesWeight && matchesTag;
    });
  }, [deferredQuery, difficulty, tag, topics, weight, isGlossary]);

  // 术语体系简化渲染
  if (isGlossary) {
    return (
      <div className="content-block-body">
        <div className="filter-controls">
          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="按标题、摘要或标签筛选"
          />
        </div>

        <div className="topic-list">
          {filteredTopics.map((topic) => (
            <Link key={topic.slug} href={`/${category}/${topic.slug}`} className="topic-list-item">
              <div>
                <div className="topic-list-head">
                  <strong>{topic.title}</strong>
                  <DifficultyBadge difficulty={topic.difficulty} />
                </div>
                <p>{topic.summary}</p>
              </div>
              <div className="topic-list-tags">
                {topic.tags.slice(0, 4).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="content-block-body">
      <div className="filter-controls">
        <input
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="按标题、摘要或标签筛选"
        />
        <div className="hero-actions">
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}>
            <option value="all">全部难度</option>
            <option value="beginner">入门</option>
            <option value="interview">面试</option>
          </select>
          <select value={weight} onChange={(event) => setWeight(event.target.value as typeof weight)}>
            <option value="all">全部权重</option>
            <option value="3">权重 3</option>
            <option value="2">权重 2</option>
            <option value="1">权重 1</option>
          </select>
          <select value={tag} onChange={(event) => setTag(event.target.value)}>
            <option value="all">全部标签</option>
            {tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-strip">
        {tags.map((item) => (
          <button key={item} type="button" className="filter-pill button-reset" onClick={() => setTag(item)}>
            {item}
          </button>
        ))}
        <button type="button" className="filter-pill button-reset" onClick={() => setTag("all")}>
          清空标签
        </button>
      </div>

      <div className="topic-list">
        {filteredTopics.map((topic) => (
          <Link key={topic.slug} href={`/${category}/${topic.slug}`} className="topic-list-item">
            <div>
              <div className="topic-list-head">
                <strong>{topic.title}</strong>
                <DifficultyBadge difficulty={topic.difficulty} />
                <span className="eyebrow">权重 {topic.interviewWeight}</span>
              </div>
              <p>{topic.summary}</p>
            </div>
            <div className="topic-list-tags">
              {topic.tags.slice(0, 4).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
