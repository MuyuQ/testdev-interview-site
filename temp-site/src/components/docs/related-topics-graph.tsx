"use client";

import Link from "next/link";
import type { ContentTopic } from "@/content/types";

type RelatedTopicsGraphProps = {
  currentSlug: string;
  relatedTopics: ContentTopic[];
};

export function RelatedTopicsGraph({
  currentSlug,
  relatedTopics,
}: RelatedTopicsGraphProps) {
  if (relatedTopics.length === 0) {
    return null;
  }

  // 计算布局：当前节点在中心，相关节点围绕
  const centerX = 150;
  const centerY = 100;
  const radius = 80;

  return (
    <div className="related-topics-graph">
      <svg
        viewBox="0 0 300 200"
        className="related-topics-svg"
        aria-label="知识关联图"
      >
        {/* 连线 */}
        {relatedTopics.map((topic, index) => {
          const angle = (index / relatedTopics.length) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return (
            <line
              key={`line-${topic.slug}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              className="graph-line"
            />
          );
        })}

        {/* 当前节点（中心） */}
        <circle
          cx={centerX}
          cy={centerY}
          r={20}
          className="graph-node graph-node-current"
        />
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="graph-label graph-label-current"
        >
          当前
        </text>

        {/* 相关节点 */}
        {relatedTopics.map((topic, index) => {
          const angle = (index / relatedTopics.length) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return (
            <Link
              key={`node-${topic.slug}`}
              href={`/${topic.category}/${topic.slug}`}
            >
              <circle
                cx={x}
                cy={y}
                r={18}
                className="graph-node graph-node-related"
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="graph-label"
              >
                {topic.title.length > 4 ? topic.title.slice(0, 4) : topic.title}
              </text>
            </Link>
          );
        })}
      </svg>

      {/* 图例 */}
      <div className="graph-legend">
        {relatedTopics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/${topic.category}/${topic.slug}`}
            className="graph-legend-item"
          >
            <span className="graph-legend-dot" />
            {topic.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
