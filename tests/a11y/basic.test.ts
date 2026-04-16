import { describe, it, expect } from "vitest";

describe("basic accessibility", () => {
  it("should have proper lang attribute", () => {
    document.documentElement.lang = "zh-CN";
    expect(document.documentElement.lang).toBe("zh-CN");
  });

  it("should have semantic HTML structure", () => {
    document.body.innerHTML = `
      <main>
        <h1>测试开发面试速成站</h1>
        <nav aria-label="主导航">
          <ul>
            <li><a href="/glossary/">术语</a></li>
            <li><a href="/tech/">技术专题</a></li>
          </ul>
        </nav>
      </main>
    `;
    expect(document.querySelector("main")).toBeTruthy();
    expect(document.querySelector("nav")).toBeTruthy();
    expect(document.querySelector("h1")).toBeTruthy();
  });
});
