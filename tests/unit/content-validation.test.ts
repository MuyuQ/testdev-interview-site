import { describe, expect, it } from "vitest";
import { validateDocs, type DocInfo } from "../../scripts/validate-content";

function doc(overrides: Partial<DocInfo>): DocInfo {
  return {
    file: overrides.file ?? "file.md",
    rel: overrides.rel ?? "glossary/topic.md",
    category: overrides.category ?? "glossary",
    slug: overrides.slug ?? "topic",
    fullSlug: overrides.fullSlug ?? "glossary/topic",
    data: overrides.data ?? { category: "glossary" },
    bodyLength: overrides.bodyLength ?? 2000,
  };
}

describe("content validation", () => {
  it("reports missing and ambiguous related slugs", () => {
    const result = validateDocs([
      doc({
        rel: "glossary/a.md",
        slug: "a",
        fullSlug: "glossary/a",
        data: { category: "glossary", relatedSlugs: ["shared", "missing"] },
      }),
      doc({
        rel: "glossary/shared.md",
        slug: "shared",
        fullSlug: "glossary/shared",
      }),
      doc({
        rel: "tech/shared.md",
        category: "tech",
        slug: "shared",
        fullSlug: "tech/shared",
        data: { category: "tech" },
      }),
    ]);

    expect(result.errors).toContain(
      'glossary/a.md: relatedSlugs entry "missing" does not exist',
    );
    expect(result.errors.join("\n")).toContain(
      'relatedSlugs entry "shared" is ambiguous',
    );
  });

  it("accepts explicit category/slug related references", () => {
    const result = validateDocs([
      doc({
        rel: "glossary/a.md",
        slug: "a",
        fullSlug: "glossary/a",
        data: { category: "glossary", relatedSlugs: ["tech/shared"] },
      }),
      doc({
        rel: "glossary/shared.md",
        slug: "shared",
        fullSlug: "glossary/shared",
      }),
      doc({
        rel: "tech/shared.md",
        category: "tech",
        slug: "shared",
        fullSlug: "tech/shared",
        data: { category: "tech" },
      }),
    ]);

    expect(result.errors).toEqual([]);
  });

  it("reports invalid quiz answer indexes and duplicate quiz IDs", () => {
    const result = validateDocs([
      doc({
        rel: "glossary/a.md",
        slug: "a",
        fullSlug: "glossary/a",
        data: {
          category: "glossary",
          selfTests: [
            {
              id: "duplicate-id",
              question: "ignored",
              options: ["A"],
              correctIndex: 1,
            } as never,
          ],
        },
      }),
      doc({
        rel: "tech/b.md",
        category: "tech",
        slug: "b",
        fullSlug: "tech/b",
        data: {
          category: "tech",
          selfTests: [
            {
              id: "duplicate-id",
              question: "ignored",
              options: ["A", "B"],
              correctIndex: 0,
            } as never,
          ],
        },
      }),
    ]);

    expect(result.errors).toContain(
      'glossary/a.md: selfTests "duplicate-id" has invalid correctIndex',
    );
    expect(result.errors).toContain(
      'tech/b.md: selfTests id "duplicate-id" duplicates glossary/a.md',
    );
  });
});
