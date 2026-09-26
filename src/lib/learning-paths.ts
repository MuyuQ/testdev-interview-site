// 全站学习路径
// 10 个分类各一条路径。时长统一取文章 frontmatter 的 estimatedMinutes，
// 避免路径数据与文章元数据两处维护。

import { getCollection } from "astro:content";
import type { CategoryId, CategoryPath, PathStep } from "./paths/types";
import { beginnerPath } from "./beginner-path";
import glossaryPath from "./paths/glossary";
import techPath from "./paths/tech";
import codingPath from "./paths/coding";
import projectPath from "./paths/project";
import scenarioPath from "./paths/scenario";
import interviewChainsPath from "./paths/interview-chains";
import practiceTemplatePath from "./paths/practice-template";
import aiLearningPath from "./paths/ai-learning";
import roadmapPath from "./paths/roadmap";

// 新手教程沿用既有的 beginner-path.ts（首页也在用），转成统一结构
const beginnerCoursePath: CategoryPath = {
  id: "beginner-course",
  title: beginnerPath.title,
  description: beginnerPath.description,
  audience: beginnerPath.audience,
  steps: beginnerPath.lessons.map((lesson) => ({
    slug: lesson.slug,
    goal: lesson.goal,
    output: lesson.output,
  })),
};

export const learningPaths: CategoryPath[] = [
  beginnerCoursePath,
  roadmapPath,
  glossaryPath,
  techPath,
  codingPath,
  projectPath,
  scenarioPath,
  interviewChainsPath,
  practiceTemplatePath,
  aiLearningPath,
];

export function getPathByCategory(category: string): CategoryPath | undefined {
  return learningPaths.find((path) => path.id === category);
}

export interface ResolvedStep extends PathStep {
  index: number;
  total: number;
  href: string;
  title: string;
  minutes: number | null;
  goal: string;
  output: string;
}

export interface ResolvedPath {
  id: CategoryId;
  title: string;
  description: string;
  audience: string;
  totalMinutes: number;
  steps: ResolvedStep[];
}

// 把路径里的 slug 解析成带链接、标题、时长的步骤（需要 content 集合，异步）
export async function resolvePath(
  path: CategoryPath,
  base: string,
): Promise<ResolvedPath> {
  const entries = await getCollection("docs");
  const info = new Map<string, { title: string; minutes: number | null }>();
  for (const entry of entries) {
    const slug = entry.id.replace(/\.mdx?$/, "");
    info.set(slug, {
      title: entry.data.title ?? slug,
      minutes:
        (entry.data as { estimatedMinutes?: number }).estimatedMinutes ?? null,
    });
  }

  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const steps: ResolvedStep[] = path.steps.map((step, index) => {
    const fullSlug = `${path.id}/${step.slug}`;
    const hit = info.get(fullSlug);
    return {
      ...step,
      index: index + 1,
      total: path.steps.length,
      href: `${normalizedBase}${fullSlug}/`,
      title: hit?.title ?? step.slug,
      minutes: hit?.minutes ?? null,
    };
  });

  return {
    id: path.id,
    title: path.title,
    description: path.description,
    audience: path.audience,
    totalMinutes: steps.reduce((sum, step) => sum + (step.minutes ?? 0), 0),
    steps,
  };
}

// 取某篇文章在其分类路径中的位置
export function findStepIndex(path: CategoryPath, articleSlug: string): number {
  return path.steps.findIndex((step) => step.slug === articleSlug);
}
