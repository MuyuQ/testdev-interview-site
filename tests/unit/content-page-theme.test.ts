import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const configSource = readFileSync(
  new URL("../../astro.config.mjs", import.meta.url),
  "utf8",
);
const themeUrl = new URL(
  "../../src/styles/learning-workbench-content.css",
  import.meta.url,
);

describe("content page theme", () => {
  it("should register the shared learning workbench theme after legacy styles", () => {
    expect(configSource).toContain(
      "/src/styles/learning-workbench-content.css",
    );
    expect(
      configSource.indexOf("/src/styles/learning-workbench-content.css"),
    ).toBeGreaterThan(configSource.indexOf("/src/styles/layout-v3.css"));
  });

  it("should cover the main Starlight content page surfaces", () => {
    expect(existsSync(themeUrl)).toBe(true);

    const source = readFileSync(themeUrl, "utf8");
    expect(source).toContain(".header");
    expect(source).toContain(".sidebar-pane");
    expect(source).toContain(".main-frame");
    expect(source).toContain(".sl-markdown-content");
    expect(source).toContain(".pagination-links");
  });

  it("should keep keyboard and reduced-motion users supported", () => {
    const source = readFileSync(themeUrl, "utf8");
    expect(source).toContain(":focus-visible");
    expect(source).toContain("prefers-reduced-motion: reduce");
  });
});
