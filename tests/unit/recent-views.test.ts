import { beforeEach, describe, expect, it } from "vitest";
import {
  addRecentView,
  getRecentViews,
  getRecentViewLabel,
} from "../../src/lib/recent-views";

const mockStorage: Record<string, string> = {};

global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  },
  length: 0,
  key: (index: number) => Object.keys(mockStorage)[index] || null,
};

describe("recent-views", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("keeps recent views with the same slug in different categories", () => {
    addRecentView({
      category: "glossary",
      slug: "data-driven-testing",
      title: "数据驱动测试",
    });
    addRecentView({
      category: "tech",
      slug: "data-driven-testing",
      title: "数据驱动测试实战",
    });

    expect(getRecentViews()).toMatchObject([
      {
        category: "tech",
        slug: "data-driven-testing",
        title: "数据驱动测试实战",
      },
      {
        category: "glossary",
        slug: "data-driven-testing",
        title: "数据驱动测试",
      },
    ]);
  });

  it("deduplicates the same category and slug while keeping the latest title", () => {
    addRecentView({
      category: "tech",
      slug: "pytest",
      title: "Pytest 入门",
    });
    addRecentView({
      category: "tech",
      slug: "pytest",
      title: "Pytest 实战",
    });

    expect(getRecentViews()).toHaveLength(1);
    expect(getRecentViews()[0]).toMatchObject({
      category: "tech",
      slug: "pytest",
      title: "Pytest 实战",
    });
  });

  it("limits the stored list to ten valid entries", () => {
    for (let index = 0; index < 12; index += 1) {
      addRecentView({
        category: "tech",
        slug: `topic-${index}`,
        title: `主题 ${index}`,
      });
    }

    const recent = getRecentViews();

    expect(recent).toHaveLength(10);
    expect(recent[0]?.slug).toBe("topic-11");
    expect(recent.at(-1)?.slug).toBe("topic-2");
  });

  it("ignores malformed storage values", () => {
    localStorage.setItem(
      "testdev:recent",
      JSON.stringify([
        { category: "tech", slug: "pytest", title: "Pytest" },
        { category: "tech", slug: 123, title: "Broken" },
        null,
      ]),
    );

    expect(getRecentViews()).toMatchObject([
      { category: "tech", slug: "pytest", title: "Pytest" },
    ]);
  });

  it("falls back to category ids when a label is unknown", () => {
    expect(getRecentViewLabel("tech")).toBe("技术专题");
    expect(getRecentViewLabel("unknown")).toBe("unknown");
  });
});
