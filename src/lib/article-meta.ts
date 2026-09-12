// 文章页元数据渲染辅助
// 把 frontmatter 里的 stage / difficulty / interviewWeight / estimatedMinutes /
// prerequisites / outcomes / relatedSlugs / selfTests 转成可展示的数据

import { getCollection, type CollectionEntry } from 'astro:content';
import { categories } from './site-config';

// 阶段展示名（与 site-config 的四层首页结构对齐）
const STAGE_LABELS: Record<string, string> = {
  foundation: '基础阶段',
  practice: '实践阶段',
  project: '项目阶段',
  interview: '面试阶段',
  advanced: '进阶阶段',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '入门',
  interview: '面试',
};

export interface ArticleLink {
  slug: string;
  href: string;
  title: string;
}

export interface RelatedEntry extends ArticleLink {
  category: string;
  categoryLabel: string;
}

export interface ArticleMetaView {
  stageLabel: string | null;
  difficultyLabel: string | null;
  interviewWeight: number | null;
  minutes: number | null;
  outcomes: string[];
  prerequisites: ArticleLink[];
  related: RelatedEntry[];
}

// 规范化 base path
function normalizeBase(base: string): string {
  if (!base) return '/';
  return base.endsWith('/') ? base : `${base}/`;
}

// slug（如 tech/api-testing）转 URL
export function slugToHref(slug: string, base: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  return `${normalizeBase(base)}${clean}/`;
}

// 一次性拿到 slug -> 标题 的映射，避免每篇文章重复查询
let slugTitleCache: Map<string, { title: string; category: string }> | null = null;

async function loadSlugMap(): Promise<Map<string, { title: string; category: string }>> {
  if (slugTitleCache) return slugTitleCache;
  const entries = await getCollection('docs');
  const map = new Map<string, { title: string; category: string }>();
  for (const entry of entries) {
    // Starlight docsLoader 的 id 形如 "tech/api-testing.md"
    const slug = entry.id.replace(/\.mdx?$/, '');
    map.set(slug, {
      title: entry.data.title ?? slug,
      category: (entry.data as { category?: string }).category ?? '',
    });
  }
  slugTitleCache = map;
  return map;
}

function categoryLabel(id: string): string {
  return categories.find((c) => c.id === id)?.navLabel ?? id;
}

// 组装一篇文章的元数据视图
export async function buildArticleMeta(
  entry: CollectionEntry<'docs'>,
  base: string
): Promise<ArticleMetaView> {
  const data = entry.data as {
    stage?: string;
    difficulty?: string;
    interviewWeight?: number;
    estimatedMinutes?: number;
    outcomes?: string[];
    prerequisites?: string[];
    relatedSlugs?: string[];
  };

  const slugMap = await loadSlugMap();
  const selfSlug = entry.id.replace(/\.mdx?$/, '');

  const toLink = (slug: string): ArticleLink | null => {
    const hit = slugMap.get(slug.replace(/^\/+|\/+$/g, ''));
    if (!hit || slug.replace(/^\/+|\/+$/g, '') === selfSlug) return null;
    return { slug, href: slugToHref(slug, base), title: hit.title };
  };

  const prerequisites = (data.prerequisites ?? [])
    .map(toLink)
    .filter((x): x is ArticleLink => Boolean(x));

  const related = (data.relatedSlugs ?? [])
    .map((slug) => {
      const link = toLink(slug);
      if (!link) return null;
      const clean = slug.replace(/^\/+|\/+$/g, '');
      const cat = slugMap.get(clean)?.category ?? '';
      return { ...link, category: cat, categoryLabel: categoryLabel(cat) } satisfies RelatedEntry;
    })
    .filter((x): x is RelatedEntry => Boolean(x));

  return {
    stageLabel: data.stage ? (STAGE_LABELS[data.stage] ?? data.stage) : null,
    difficultyLabel: data.difficulty
      ? (DIFFICULTY_LABELS[data.difficulty] ?? data.difficulty)
      : null,
    interviewWeight: data.interviewWeight ?? null,
    minutes: data.estimatedMinutes ?? null,
    outcomes: data.outcomes ?? [],
    prerequisites,
    related,
  };
}

// 面试权重转文字标签
export function weightLabel(weight: number): string {
  if (weight >= 3) return '面试高频';
  if (weight === 2) return '面试中频';
  return '面试低频';
}
