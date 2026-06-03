import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import matter from "gray-matter";
import { categories } from "../src/lib/site-config";

export interface SelfTest {
  id: string;
  options: string[];
  correctIndex: number;
}

export interface Frontmatter {
  title?: string;
  category?: string;
  relatedSlugs?: string[];
  selfTests?: SelfTest[];
}

export interface DocInfo {
  file: string;
  rel: string;
  category: string;
  slug: string;
  fullSlug: string;
  data: Frontmatter;
  body: string;
  bodyLength: number;
}

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

function walkMarkdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkMarkdownFiles(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      return [fullPath];
    }

    return [];
  });
}

export function loadDocs(root = resolve("src/content/docs")): DocInfo[] {
  return walkMarkdownFiles(root).map((file) => {
    const raw = readFileSync(file, "utf8");
    const parsed = matter(raw);
    const rel = relative(root, file).replaceAll("\\", "/");
    const [category, filename] = rel.split("/");
    const slug = filename.replace(/\.md$/, "");

    return {
      file,
      rel,
      category,
      slug,
      fullSlug: `${category}/${slug}`,
      data: parsed.data as Frontmatter,
      body: parsed.content,
      bodyLength: parsed.content.trim().length,
    };
  });
}

export function validateDocs(
  docs: DocInfo[],
  options: { checkSiteConfig?: boolean } = {},
): ValidationResult {
  const siteBase = "/testdev-interview-site/";
  const staticPages = new Set(["tags", "difficulty"]);
  const errors: string[] = [];
  const warnings: string[] = [];
  const bySlug = new Map<string, DocInfo[]>();
  const byFullSlug = new Map<string, DocInfo>();
  const selfTestIds = new Map<string, string>();
  const checkSiteConfig = options.checkSiteConfig ?? false;

  for (const doc of docs) {
    byFullSlug.set(doc.fullSlug, doc);
    bySlug.set(doc.slug, [...(bySlug.get(doc.slug) ?? []), doc]);
  }

  for (const doc of docs) {
    if (doc.data.category !== doc.category) {
      errors.push(`${doc.rel}: category must be "${doc.category}"`);
    }

    for (const related of doc.data.relatedSlugs ?? []) {
      const matches = related.includes("/")
        ? byFullSlug.has(related)
          ? [byFullSlug.get(related)!]
          : []
        : bySlug.get(related) ?? [];

      if (matches.length === 0) {
        errors.push(`${doc.rel}: relatedSlugs entry "${related}" does not exist`);
      }

      if (matches.length > 1) {
        errors.push(
          `${doc.rel}: relatedSlugs entry "${related}" is ambiguous (${matches
            .map((match) => match.fullSlug)
            .join(", ")})`,
        );
      }
    }

    if (!doc.data.selfTests || doc.data.selfTests.length === 0) {
      warnings.push(`${doc.rel}: no selfTests`);
    }

    if (doc.bodyLength < 1500) {
      warnings.push(`${doc.rel}: short body (${doc.bodyLength} chars)`);
    }

    for (const selfTest of doc.data.selfTests ?? []) {
      if (
        !Array.isArray(selfTest.options) ||
        selfTest.correctIndex < 0 ||
        selfTest.correctIndex >= selfTest.options.length
      ) {
        errors.push(
          `${doc.rel}: selfTests "${selfTest.id}" has invalid correctIndex`,
        );
      }

      const previousFile = selfTestIds.get(selfTest.id);
      if (previousFile) {
        errors.push(
          `${doc.rel}: selfTests id "${selfTest.id}" duplicates ${previousFile}`,
        );
      } else {
        selfTestIds.set(selfTest.id, doc.rel);
      }
    }

    for (const link of extractMarkdownLinks(doc.body)) {
      if (link.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(link)) {
        continue;
      }

      const pathWithoutHash = link.split("#", 1)[0] ?? "";
      const pathWithoutQuery = pathWithoutHash.split("?", 1)[0] ?? "";

      if (!pathWithoutQuery.startsWith("/")) {
        continue;
      }

      if (!pathWithoutQuery.startsWith(siteBase)) {
        errors.push(
          `${doc.rel}: markdown link "${link}" must include "${siteBase}" for GitHub Pages`,
        );
        continue;
      }

      const route = pathWithoutQuery
        .slice(siteBase.length)
        .replace(/^\/+|\/+$/g, "");

      if (!route || staticPages.has(route) || byFullSlug.has(route)) {
        continue;
      }

      errors.push(
        `${doc.rel}: markdown link "${link}" does not resolve to a known page`,
      );
    }
  }

  if (checkSiteConfig) {
    for (const category of categories) {
      if (!category.recommendedSlug) {
        continue;
      }

      const expected = resolve(
        "src/content/docs",
        category.id,
        `${category.recommendedSlug}.md`,
      );

      if (!existsSync(expected)) {
        errors.push(
          `site-config: ${category.id}.recommendedSlug "${category.recommendedSlug}" does not exist`,
        );
      }
    }
  }

  return { errors, warnings };
}

function extractMarkdownLinks(content: string): string[] {
  const links: string[] = [];
  const linkPattern = /(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

  for (const match of content.matchAll(linkPattern)) {
    const target = match[1]?.trim();
    if (target) {
      links.push(target);
    }
  }

  return links;
}

function isDirectRun(): boolean {
  const currentFile = new URL(import.meta.url).pathname
    .replace(/^\/([A-Za-z]:)/, "$1")
    .replaceAll("/", "\\");
  const invokedFile = process.argv[1] ?? "";

  return currentFile.toLowerCase() === invokedFile.toLowerCase();
}

if (isDirectRun()) {
  const result = validateDocs(loadDocs(), { checkSiteConfig: true });

  for (const warning of result.warnings) {
    console.warn(`WARN ${warning}`);
  }

  for (const error of result.errors) {
    console.error(`ERROR ${error}`);
  }

  if (result.errors.length > 0) {
    process.exitCode = 1;
  }
}
