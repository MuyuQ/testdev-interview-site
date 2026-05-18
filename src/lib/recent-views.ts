export interface RecentView {
  slug: string;
  title: string;
  category: string;
  viewedAt: string;
}

const STORAGE_KEY = "testdev:recent";
const MAX_RECENT = 10;

const CATEGORY_LABELS: Record<string, string> = {
  glossary: "术语体系",
  tech: "技术专题",
  project: "项目类型",
  scenario: "场景题",
  coding: "编码题",
  roadmap: "学习路线",
  "ai-learning": "AI 学习",
  "practice-template": "练手模板",
  "interview-chains": "面试追问链",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeRecentView(value: unknown): RecentView | null {
  if (!isRecord(value)) {
    return null;
  }

  const { category, slug, title, viewedAt } = value;
  if (
    typeof category !== "string" ||
    typeof slug !== "string" ||
    typeof title !== "string"
  ) {
    return null;
  }

  const normalized = {
    category: category.trim(),
    slug: slug.trim(),
    title: title.trim(),
    viewedAt:
      typeof viewedAt === "string" && viewedAt.trim().length > 0
        ? viewedAt
        : new Date(0).toISOString(),
  };

  if (
    normalized.category.length === 0 ||
    normalized.slug.length === 0 ||
    normalized.title.length === 0
  ) {
    return null;
  }

  return normalized;
}

function readRecentViews(): RecentView[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeRecentView)
      .filter((item): item is RecentView => item !== null)
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

function writeRecentViews(recent: RecentView[]): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT)),
  );
}

export function getRecentViews(limit = MAX_RECENT): RecentView[] {
  return readRecentViews().slice(0, limit);
}

export function addRecentView(
  view: Pick<RecentView, "category" | "slug" | "title">,
): void {
  const normalized = normalizeRecentView({
    ...view,
    viewedAt: new Date().toISOString(),
  });

  if (!normalized) {
    return;
  }

  const recent = readRecentViews().filter(
    (item) =>
      item.category !== normalized.category || item.slug !== normalized.slug,
  );

  recent.unshift(normalized);
  writeRecentViews(recent);
}

export function getRecentViewLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
