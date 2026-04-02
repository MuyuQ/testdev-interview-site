"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { getAllTopics } from "@/content";
import type { TopicCategory, ContentTopic } from "@/content/types";
import { categoryConfig, orderedCategories } from "@/lib/site-config";

type TopicNode = {
  slug: string;
  title: string;
  category: TopicCategory;
  x: number;
  y: number;
};

type Relation = {
  from: string;
  to: string;
};

const categoryColors: Record<TopicCategory, { fill: string; stroke: string; bg: string }> = {
  glossary: { fill: "#34d399", stroke: "#059669", bg: "rgba(52, 211, 153, 0.1)" },
  tech: { fill: "#60a5fa", stroke: "#2563eb", bg: "rgba(96, 165, 250, 0.1)" },
  project: { fill: "#f472b6", stroke: "#db2777", bg: "rgba(244, 114, 182, 0.1)" },
  scenario: { fill: "#fbbf24", stroke: "#d97706", bg: "rgba(251, 191, 36, 0.1)" },
  coding: { fill: "#a78bfa", stroke: "#7c3aed", bg: "rgba(167, 139, 250, 0.1)" },
  roadmap: { fill: "#fb923c", stroke: "#ea580c", bg: "rgba(251, 146, 60, 0.1)" },
  "ai-learning": { fill: "#2dd4bf", stroke: "#0d9488", bg: "rgba(45, 212, 191, 0.1)" },
  "practice-template": { fill: "#c084fc", stroke: "#9333ea", bg: "rgba(192, 132, 252, 0.1)" },
};

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 800;
const NODE_RADIUS = 24;
const CATEGORY_PADDING = 20;
const CATEGORY_HEADER_HEIGHT = 40;

export function KnowledgeMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCategories, setVisibleCategories] = useState<Set<TopicCategory>>(
    new Set(orderedCategories)
  );
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const allTopics = getAllTopics();

  // 构建节点和关系数据
  const { nodes, relations, categoryBounds } = useMemo(() => {
    // 按分类分组
    const topicsByCategory: Record<TopicCategory, ContentTopic[]> = {} as Record<TopicCategory, ContentTopic[]>;

    allTopics.forEach((topic) => {
      if (!topicsByCategory[topic.category]) {
        topicsByCategory[topic.category] = [];
      }
      topicsByCategory[topic.category].push(topic);
    });

    // 计算每个分类的布局区域
    const categoriesInOrder = orderedCategories;
    const cols = 4;
    const rows = Math.ceil(categoriesInOrder.length / cols);
    const colWidth = SVG_WIDTH / cols;
    const rowHeight = SVG_HEIGHT / rows;

    const categoryBounds: Record<TopicCategory, { x: number; y: number; width: number; height: number }> =
      {} as Record<TopicCategory, { x: number; y: number; width: number; height: number }>;

    categoriesInOrder.forEach((cat, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      categoryBounds[cat] = {
        x: col * colWidth + CATEGORY_PADDING,
        y: row * rowHeight + CATEGORY_HEADER_HEIGHT + CATEGORY_PADDING,
        width: colWidth - CATEGORY_PADDING * 2,
        height: rowHeight - CATEGORY_HEADER_HEIGHT - CATEGORY_PADDING * 2,
      };
    });

    // 为每个分类内的 topic 分配位置（网格布局）
    const nodes: TopicNode[] = [];
    const slugToNode = new Map<string, TopicNode>();

    Object.entries(topicsByCategory).forEach(([category, topics]) => {
      const bounds = categoryBounds[category as TopicCategory];
      if (!bounds) return;

      const topicsInRow = Math.ceil(Math.sqrt(topics.length));
      const cellWidth = bounds.width / topicsInRow;
      const cellHeight = bounds.height / Math.ceil(topics.length / topicsInRow);

      topics.forEach((topic, index) => {
        const col = index % topicsInRow;
        const row = Math.floor(index / topicsInRow);
        const x = bounds.x + col * cellWidth + cellWidth / 2;
        const y = bounds.y + row * cellHeight + cellHeight / 2;

        const node: TopicNode = {
          slug: topic.slug,
          title: topic.title,
          category: topic.category,
          x,
          y,
        };
        nodes.push(node);
        slugToNode.set(topic.slug, node);
      });
    });

    // 构建关系（based on relatedSlugs）
    const relations: Relation[] = [];
    const seenRelations = new Set<string>();

    allTopics.forEach((topic) => {
      if (topic.relatedSlugs) {
        topic.relatedSlugs.forEach((relatedSlug) => {
          const relationKey = [topic.slug, relatedSlug].sort().join("-");
          if (!seenRelations.has(relationKey) && slugToNode.has(relatedSlug)) {
            seenRelations.add(relationKey);
            relations.push({
              from: topic.slug,
              to: relatedSlug,
            });
          }
        });
      }
    });

    return { nodes, relations, categoryBounds };
  }, [allTopics]);

  // 过滤节点
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) {
      return nodes.filter((node) => visibleCategories.has(node.category));
    }
    const query = searchQuery.toLowerCase();
    return nodes.filter(
      (node) =>
        visibleCategories.has(node.category) &&
        (node.title.toLowerCase().includes(query) || node.slug.toLowerCase().includes(query))
    );
  }, [nodes, searchQuery, visibleCategories]);

  const filteredNodeSlugs = useMemo(() => new Set(filteredNodes.map((n) => n.slug)), [filteredNodes]);

  // 过滤关系（只显示两端都在可见节点中的关系）
  const filteredRelations = useMemo(() => {
    return relations.filter((r) => filteredNodeSlugs.has(r.from) && filteredNodeSlugs.has(r.to));
  }, [relations, filteredNodeSlugs]);

  // 切换分类可见性
  const toggleCategory = useCallback((category: TopicCategory) => {
    setVisibleCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  // 全选/取消全选
  const toggleAllCategories = useCallback(() => {
    setVisibleCategories((prev) => {
      if (prev.size === orderedCategories.length) {
        return new Set();
      }
      return new Set(orderedCategories);
    });
  }, []);

  const nodeMap = useMemo(() => new Map(filteredNodes.map((n) => [n.slug, n])), [filteredNodes]);

  // 缩放状态
  const [scale, setScale] = useState(1);
  const minScale = 0.5;
  const maxScale = 2;

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, maxScale));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, minScale));
  }, []);

  const handleZoomReset = useCallback(() => {
    setScale(1);
  }, []);

  return (
    <div className="knowledge-map-container">
      {/* 控制区域：移动端堆叠，桌面端水平 */}
      <div className="flex flex-col md:flex-row gap-3 p-4 bg-[var(--panel)] rounded-xl border border-[var(--line)]">
        {/* 搜索框 */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="搜索知识点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[2.5rem] px-4 rounded-lg border border-[var(--line)] bg-[var(--input-bg)] text-[var(--input-fg)] text-[0.95rem] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-soft)]"
          />
        </div>

        {/* 缩放控制按钮 */}
        <div className="flex items-center gap-1 bg-[var(--panel-strong)] border border-[var(--line)] rounded-lg p-1 shrink-0">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= minScale}
            className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-[var(--foreground)] cursor-pointer rounded-md text-lg hover:bg-[var(--line)] disabled:opacity-50 disabled:cursor-not-allowed"
            title="缩小"
          >
            −
          </button>
          <span className="px-2 text-[0.85rem] text-[var(--muted)]">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= maxScale}
            className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-[var(--foreground)] cursor-pointer rounded-md text-lg hover:bg-[var(--line)] disabled:opacity-50 disabled:cursor-not-allowed"
            title="放大"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomReset}
            className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-[var(--foreground)] cursor-pointer rounded-md text-sm hover:bg-[var(--line)]"
            title="重置"
          >
            ⟲
          </button>
        </div>

        {/* 分类筛选按钮组：移动端水平滚动 */}
        <div className="flex flex-wrap md:flex-row gap-2 items-center overflow-x-auto pb-1 md:pb-0 md:shrink-0">
          <button
            type="button"
            className="shrink-0 min-h-[2rem] px-3 py-1 rounded-lg border border-[var(--line)] bg-[var(--panel-strong)] text-[var(--foreground)] text-[0.85rem] font-medium cursor-pointer transition-all hover:bg-[var(--accent-soft)] hover:border-[var(--accent)]"
            onClick={toggleAllCategories}
            title={visibleCategories.size === orderedCategories.length ? "隐藏全部" : "显示全部"}
          >
            {visibleCategories.size === orderedCategories.length ? "隐藏全部" : "显示全部"}
          </button>
          {orderedCategories.map((cat) => {
            const isVisible = visibleCategories.has(cat);
            const colors = categoryColors[cat];
            return (
              <button
                key={cat}
                type="button"
                className={`shrink-0 min-h-[2rem] px-3 py-1 rounded-full border text-[0.85rem] font-medium cursor-pointer transition-all hover:-translate-y-px ${isVisible ? "font-semibold" : ""}`}
                onClick={() => toggleCategory(cat)}
                style={{
                  backgroundColor: isVisible ? colors.bg : "transparent",
                  borderColor: isVisible ? colors.stroke : "var(--line)",
                  color: isVisible ? colors.stroke : "var(--muted)",
                }}
              >
                {categoryConfig[cat].navLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG 容器：响应式高度 */}
      <div className="w-full h-[400px] md:h-[600px] overflow-auto bg-[var(--panel)] rounded-xl border border-[var(--line)] p-2 md:p-4">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          style={{
            width: `${SVG_WIDTH * scale}px`,
            height: `${SVG_HEIGHT * scale}px`,
            minWidth: "100%",
          }}
          className="knowledge-map-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--line)" />
            </marker>
          </defs>

          {/* 绘制关系连线 */}
          {filteredRelations.map((relation, index) => {
            const fromNode = nodeMap.get(relation.from);
            const toNode = nodeMap.get(relation.to);
            if (!fromNode || !toNode) return null;

            return (
              <line
                key={`relation-${index}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="var(--line)"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          {/* 绘制分类背景区域 */}
          {orderedCategories.map((cat) => {
            if (!visibleCategories.has(cat)) return null;
            const bounds = categoryBounds[cat];
            const colors = categoryColors[cat];
            return (
              <g key={`category-bg-${cat}`}>
                <rect
                  x={bounds.x}
                  y={bounds.y}
                  width={bounds.width}
                  height={bounds.height}
                  fill={colors.bg}
                  rx="8"
                  stroke={colors.stroke}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  strokeOpacity="0.3"
                />
                <text
                  x={bounds.x + 10}
                  y={bounds.y - 8}
                  fontSize="14"
                  fontWeight="600"
                  fill={colors.stroke}
                >
                  {categoryConfig[cat].title}
                </text>
              </g>
            );
          })}

          {/* 绘制节点 */}
          {filteredNodes.map((node) => {
            const colors = categoryColors[node.category];
            const isHovered = hoveredNode === node.slug;

            return (
              <g
                key={node.slug}
                className="knowledge-node"
                onMouseEnter={() => setHoveredNode(node.slug)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <Link href={`/${node.category}/${node.slug}`}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? NODE_RADIUS + 4 : NODE_RADIUS}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth="2"
                    className="node-circle"
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="500"
                    fill="#fff"
                    className="node-label"
                  >
                    {node.title.length > 6 ? node.title.slice(0, 5) + "..." : node.title}
                  </text>
                  {isHovered && (
                    <g className="node-tooltip">
                      <rect
                        x={node.x - 60}
                        y={node.y - NODE_RADIUS - 35}
                        width="120"
                        height="28"
                        rx="6"
                        fill="var(--panel-strong)"
                        stroke="var(--line)"
                      />
                      <text
                        x={node.x}
                        y={node.y - NODE_RADIUS - 16}
                        textAnchor="middle"
                        fontSize="12"
                        fill="var(--foreground)"
                      >
                        {node.title}
                      </text>
                    </g>
                  )}
                </Link>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 图例：响应式布局 */}
      <div className="p-4 bg-[var(--panel)] rounded-xl border border-[var(--line)]">
        <p className="text-[0.95rem] font-semibold text-[var(--foreground)] mb-3">图例说明</p>
        <div className="flex flex-wrap gap-3">
          {orderedCategories.map((cat) => {
            const colors = categoryColors[cat];
            return (
              <div key={`legend-${cat}`} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: colors.fill, border: `1px solid ${colors.stroke}` }}
                />
                <span className="text-[0.85rem] text-[var(--muted)]">{categoryConfig[cat].title}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[0.85rem] text-[var(--muted)]">点击节点进入详情页，连线表示知识点关联。移动端可使用缩放按钮调整视图。</p>
      </div>
    </div>
  );
}
