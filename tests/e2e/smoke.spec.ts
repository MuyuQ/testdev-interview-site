// 端到端冒烟测试:覆盖首页、文档文章页与分类落地页的核心用户路径
import { expect, test } from "@playwright/test";

test.describe("首页", () => {
  test("渲染首屏、内容统计与学习路径面板", async ({ page }) => {
    await page.goto("./");

    await expect(page).toHaveTitle("测试开发面试速成站");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "找到下一步",
    );

    // 内容统计来自构建时真实数据
    await expect(page.locator(".hero-stat")).toHaveCount(4);

    // 学习路径面板:当前建议步骤可点击
    await expect(page.locator("[data-learning-path]")).toBeVisible();
    await expect(page.locator("[data-current-step-link]")).toBeVisible();

    // 四层能力地图包含全部 10 个模块入口
    await expect(page.locator(".module-link")).toHaveCount(10);
  });

  test("主题切换在深浅色之间往返并持久化", async ({ page }) => {
    await page.goto("./");

    const html = page.locator("html");
    const initial = await html.getAttribute("data-theme");
    expect(initial).toMatch(/^(light|dark)$/);

    await page.locator("[data-theme-toggle]").click();
    const afterToggle = await html.getAttribute("data-theme");
    expect(afterToggle).not.toBe(initial);

    // 刷新后主题保持(写入 localStorage 的 starlight-theme)
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", afterToggle!);
  });

  test("进度脚本把继续学习链接指向路径中的当前步骤", async ({ page }) => {
    await page.goto("./");

    const continueLink = page.locator("header [data-continue-learning]");
    await expect(continueLink).toHaveAttribute(
      "href",
      /beginner-course\/start-here/,
    );
  });
});

test.describe("文档文章页", () => {
  test("文章页渲染元数据、学习路径与自测题", async ({ page }) => {
    await page.goto("beginner-course/pytest-first-test/");

    await expect(page).toHaveTitle(/Pytest 第一个测试/);
    await expect(page.locator(".article-meta")).toBeVisible();
    await expect(page.locator(".learning-path")).toBeVisible();
    await expect(page.locator(".self-tests")).toBeVisible();

    // 页面语言与界面文案为中文
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    await expect(page.getByText("自测一下")).toBeVisible();
  });

  test("自测题点击选项后判定对错并展示解析", async ({ page }) => {
    await page.goto("beginner-course/pytest-first-test/");

    const firstQuiz = page.locator("[data-quiz]").first();
    const options = firstQuiz.locator(".quiz-option");
    await options.first().click();

    // 答题后全部选项锁定,解析可见
    await expect(options.first()).toBeDisabled();
    await expect(firstQuiz.locator(".quiz-explanation")).toBeVisible();
  });

  test("侧边栏可以在模块间跳转", async ({ page }) => {
    await page.goto("beginner-course/pytest-first-test/");

    await page.locator(".sidebar-content a", { hasText: "术语体系" }).click();
    await expect(page).toHaveURL(/glossary/);
  });
});

test.describe("分类落地页", () => {
  test("分类页渲染完整学习路径", async ({ page }) => {
    await page.goto("tech/");

    await expect(
      page.getByRole("heading", { name: "技术专题" }).first(),
    ).toBeVisible();
    await expect(page.locator(".learning-path-full")).toBeVisible();
  });
});
