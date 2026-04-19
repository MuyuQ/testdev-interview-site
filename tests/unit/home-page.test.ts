import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getHomePageData, getProgressPercentage } from "../../src/lib/home-page";

const projectRoot = resolve(__dirname, "../..");

describe("home-page data", () => {
  it("should point roadmap links to existing documents", () => {
    const { roadmapLinks } = getHomePageData("/testdev-interview-site/");

    for (const link of roadmapLinks) {
      const filePath = resolve(
        projectRoot,
        "src",
        "content",
        "docs",
        "roadmap",
        `${link.slug}.md`,
      );

      expect(existsSync(filePath)).toBe(true);
      expect(link.href).toContain(`/roadmap/${link.slug}/`);
    }
  });

  it("should point module links to existing documents", () => {
    const { moduleLinks } = getHomePageData("/testdev-interview-site/");

    for (const link of moduleLinks) {
      const filePath = resolve(
        projectRoot,
        "src",
        "content",
        "docs",
        link.category,
        `${link.slug}.md`,
      );

      expect(existsSync(filePath)).toBe(true);
      expect(link.href).toContain(`/${link.category}/${link.slug}/`);
    }
  });

  it("should calculate progress percentage from the real total doc count", () => {
    expect(getProgressPercentage(55, 110)).toBe(50);
    expect(getProgressPercentage(120, 110)).toBe(100);
    expect(getProgressPercentage(5, 0)).toBe(0);
  });
});
