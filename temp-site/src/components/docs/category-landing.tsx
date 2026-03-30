import { DocsFrame } from "./docs-frame";
import { CategoryFilterPanel } from "@/components/client/category-filter-panel";
import type { ContentTopic, TopicCategory } from "@/content/types";
import { categoryConfig } from "@/lib/site-config";

type CategoryLandingProps = {
  category: TopicCategory;
  topics: ContentTopic[];
};

export function CategoryLanding({ category, topics }: CategoryLandingProps) {
  const config = categoryConfig[category];
  const uniqueTags = Array.from(new Set(topics.flatMap((topic) => topic.tags))).slice(0, 12);

  return (
    <DocsFrame
      category={category}
      toc={[
        { id: "category-summary", label: "模块说明" },
        { id: "category-filters", label: "筛选维度" },
        { id: "category-list", label: "内容列表" },
      ]}
    >
      <div className="docs-article" id="page-top">
        <section className="topic-hero" id="category-summary">
          <p className="eyebrow">{config.navLabel}</p>
          <h1>{config.title}</h1>
          <p className="topic-summary">{config.description}</p>
          <div className="topic-meta-row">
            <span>{topics.length} 个条目</span>
            <span>文档型结构</span>
            <span>支持本地搜索与学习进度</span>
          </div>
        </section>

        <section className="content-block" id="category-filters">
          <div className="content-block-head">
            <h2>筛选维度</h2>
            <p>首版支持按标签、难度和面试权重快速浏览。</p>
          </div>
          <div className="content-block-body">
            <div className="filter-strip">
              <span className="filter-pill">入门</span>
              <span className="filter-pill">面试</span>
              <span className="filter-pill">面试权重 3</span>
              <span className="filter-pill">面试权重 2</span>
              <span className="filter-pill">面试权重 1</span>
              {uniqueTags.map((tag) => (
                <span key={tag} className="filter-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="content-block" id="category-list">
          <div className="content-block-head">
            <h2>内容列表</h2>
            <p>支持按标题、标签、难度和权重筛选，方便快速聚焦高频节点。</p>
          </div>
          <CategoryFilterPanel category={category} topics={topics} />
        </section>
      </div>
    </DocsFrame>
  );
}
