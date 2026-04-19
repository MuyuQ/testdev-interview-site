import { categories } from "./site-config";

export interface HomePageLink {
  category: string;
  href: string;
  slug: string;
  title: string;
  description: string;
}

function normalizeBase(base: string): string {
  return base.endsWith("/") ? base : `${base}/`;
}

export function getProgressPercentage(
  completedCount: number,
  totalDocsCount: number,
): number {
  if (totalDocsCount <= 0) {
    return 0;
  }

  return Math.min((completedCount / totalDocsCount) * 100, 100);
}

export function getHomePageData(base: string): {
  roadmapLinks: HomePageLink[];
  moduleLinks: HomePageLink[];
} {
  const normalizedBase = normalizeBase(base);

  return {
    roadmapLinks: [
      {
        category: "roadmap",
        href: `${normalizedBase}roadmap/3-day-interview-map/`,
        slug: "3-day-interview-map",
        title: "3 天速记版",
        description: "高频术语和核心概念快速记忆",
      },
      {
        category: "roadmap",
        href: `${normalizedBase}roadmap/7-day-interview-plan/`,
        slug: "7-day-interview-plan",
        title: "7 天面试版",
        description: "技术专题 + 项目经验 + 场景题",
      },
    ],
    moduleLinks: categories
      .filter(
        (category): category is typeof category & { recommendedSlug: string } =>
          typeof category.recommendedSlug === "string",
      )
      .map((category) => ({
        category: category.id,
        href: `${normalizedBase}${category.id}/${category.recommendedSlug}/`,
        slug: category.recommendedSlug,
        title: category.navLabel,
        description: category.description,
      })),
  };
}
