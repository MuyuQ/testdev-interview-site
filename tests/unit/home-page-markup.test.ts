import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("../../src/pages/index.astro", import.meta.url),
  "utf8",
);

describe("home page markup", () => {
  it("should declare a Chinese UTF-8 document", () => {
    expect(source).toContain('<html lang="zh-CN">');
    expect(source).toContain('<meta charset="utf-8" />');
    expect(source).toContain("favicon.svg");
    expect(source).toContain("`${base}favicon.svg`");
  });

  it("should present the homepage as a learning decision workbench", () => {
    expect(source).toContain("找到下一步，把测试开发能力练出来");
    expect(source).toContain("data-learning-path");
    expect(source).toContain("四层能力地图");
  });

  it("should provide accessible progressive-enhancement hooks", () => {
    expect(source).toMatch(
      /aria-current=\{index === 0 \? ["']step["'] : undefined\}/,
    );
    expect(source).toContain("data-continue-learning");
    expect(source).toContain("prefers-reduced-motion: reduce");
    expect(source).toMatch(
      /completedSlugs\.filter\(\(slug\) => pathSlugs\.has\(slug\)\)/,
    );
  });
});
