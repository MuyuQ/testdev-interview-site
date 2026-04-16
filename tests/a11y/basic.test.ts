import { test, expect } from "vitest";
import { createAxeBuilder } from "vitest-axe";

const axeBuilder = createAxeBuilder({ test });

test("homepage should have no accessibility violations", async () => {
  // Note: This test requires a running dev server
  // Run with: npm run test:a11y
  const response = await fetch("http://localhost:4321/TestDev-Sprint/");
  expect(response.ok).toBe(true);
});

test("basic page structure should be accessible", async () => {
  const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head><meta charset="utf-8"><title>Test</title></head>
    <body><main><h1>测试开发面试速成站</h1></main></body>
    </html>
  `;
  const results = await axeBuilder.source(html).analyze();
  expect(results.violations).toEqual([]);
});
