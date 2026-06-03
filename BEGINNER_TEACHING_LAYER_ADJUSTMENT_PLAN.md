# Beginner Teaching Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a focused beginner teaching layer that helps a zero-to-junior learner complete a 7-day path, write a first API automation mini-project, and then transition into the existing interview-prep content.

**Architecture:** Keep the current Astro 6 + Starlight static-docs architecture. Add one new content category, `beginner-course`, with a small complete MVP curriculum, data-driven path metadata, homepage dual entry points, content validation, and regression tests. Existing interview content remains intact and becomes extension reading rather than being rewritten.

**Tech Stack:** Astro 6, Starlight, TypeScript, Markdown content collections, Vitest, Playwright, localStorage, GitHub Pages.

**Related Content Guide:** Use `MODULE_CONTENT_ORGANIZATION_GUIDE.md` as the module-level writing and validation reference. This implementation plan executes the `beginner-course` portion of that guide and connects the new beginner layer back into `glossary`, `tech`, `practice-template`, `scenario`, `project`, and `interview-chains`.

---

## 1. Scope And Positioning

### 1.1 Problem

The current site is strong as an interview knowledge base, but it is too dense for true beginners. It assumes users can already connect concepts such as HTTP, Pytest, API testing, assertions, fixtures, mock services, CI, and project expression. A beginner needs a much gentler path: one idea at a time, one small exercise at a time, and clear handoff into interview language.

### 1.2 Product Decision

Do not dilute existing interview content. Add a separate beginner teaching layer:

- Beginner layer: learn by doing.
- Interview layer: revise, express, and handle follow-up questions.

The first deliverable is one small but complete beginner MVP:

> Functional testing or zero-code beginner completes a 7-day path, understands what test development is, writes a first Pytest API test, finishes a tiny mock-login mini-project, and learns how to describe that experience in an interview.

### 1.3 Non-Goals For This First Iteration

This plan does not build a full course platform, account system, video system, grading service, online code runner, or complete Playwright course. It creates the teaching structure and one complete beginner path. More courses should be added after this path proves usable.

### 1.4 Success Criteria

- A beginner can enter from the homepage without being pushed directly into interview-dense pages.
- The beginner path has exactly 8 MVP lessons with a clear sequence.
- Each lesson uses a consistent teaching template.
- Each lesson contains a concrete exercise and a next step.
- Existing interview content is linked as extension material.
- `npm run check` passes.
- Chromium smoke E2E passes.
- Navigation tests prove the beginner entry and first lesson flow work.

---

## 2. Target Beginner Profile

### 2.1 Primary User

The MVP targets this user:

- Has done manual or functional testing, or is new to testing.
- Has little or no automation experience.
- Can install software and follow command-line steps with guidance.
- Does not yet understand how Python, Pytest, HTTP, API testing, assertions, and interview expression fit together.
- Wants a practical route toward test development interviews.

### 2.2 Secondary Users

Secondary users include:

- Users who know a little Python but have never written tests.
- Users who used Postman but have not built automated tests.
- Users who have copied automation code but cannot explain it.

### 2.3 Learning Strength

The beginner path should feel like guided practice, not a reference manual.

Each lesson should use this intensity:

- One main concept.
- One simple mental model.
- One minimum working example.
- One guided exercise.
- One common mistake.
- One interview expression point.
- One next lesson link.

---

## 3. New Information Architecture

### 3.1 Add New Category

Add a new Starlight content category:

```text
beginner-course
```

User-facing label:

```text
新手教程
```

Role:

```text
从零开始的课程化教学路径，帮助初学者先学会，再进入面试冲刺内容。
```

### 3.2 Keep Existing Categories

Existing categories remain:

- `glossary`
- `tech`
- `project`
- `scenario`
- `coding`
- `roadmap`
- `ai-learning`
- `practice-template`
- `interview-chains`

### 3.3 Recommended Sidebar Order

After adding beginner course, sidebar order should become:

1. 新手教程
2. 学习路线
3. 术语体系
4. 技术专题
5. 编码题
6. 项目类型
7. 场景题
8. 面试追问链
9. 练手模板
10. AI 学习指南
11. 分类索引

Reason:

- Beginners see the guided path first.
- Existing interview users can still go directly to route, glossary, tech, project, scenario, and chains.
- Practice templates move after interview chains because they are supporting artifacts, not the main first path.

### 3.4 Homepage Entry Model

Homepage should clearly split two paths:

```text
我是初学者：从零开始
我有基础：冲刺面试
```

Beginner entry target:

```text
/beginner-course/start-here/
```

Interview entry target:

```text
/roadmap/3-day-interview-map/
```

---

## 4. MVP Curriculum

### 4.1 Eight Lessons

Create 8 beginner-course documents:

1. `src/content/docs/beginner-course/start-here.md`
2. `src/content/docs/beginner-course/testdev-role-map.md`
3. `src/content/docs/beginner-course/python-testing-minimum.md`
4. `src/content/docs/beginner-course/pytest-first-test.md`
5. `src/content/docs/beginner-course/http-api-basics.md`
6. `src/content/docs/beginner-course/pytest-api-first-case.md`
7. `src/content/docs/beginner-course/mock-login-mini-project.md`
8. `src/content/docs/beginner-course/interview-expression-for-first-project.md`

### 4.2 Lesson Goals

| Lesson                                 | Goal                                         | Output                                                         |
| -------------------------------------- | -------------------------------------------- | -------------------------------------------------------------- |
| start-here                             | Understand the 7-day beginner route          | User knows what to learn and how to use the site               |
| testdev-role-map                       | Understand what test development means       | User can explain the role in plain language                    |
| python-testing-minimum                 | Learn minimum Python needed for tests        | User can read a function, condition, list, dict, and assertion |
| pytest-first-test                      | Write the first Pytest test                  | User can run one passing and one failing test                  |
| http-api-basics                        | Understand HTTP and API basics               | User can explain request, response, status code, JSON          |
| pytest-api-first-case                  | Write first API test with Pytest             | User can call an API and assert status/body                    |
| mock-login-mini-project                | Finish a tiny login API testing mini-project | User has a small project story                                 |
| interview-expression-for-first-project | Convert practice into interview expression   | User can describe the mini-project in 2 minutes                |

### 4.3 Teaching Template

Every beginner lesson must use this structure:

```md
## 你会学到什么

## 为什么要学

## 前置知识

## 核心概念

## 最小示例

## 手把手练习

## 检查标准

## 常见错误

## 面试怎么说

## 下一步
```

### 4.4 Lesson Length Target

Each lesson should target:

- 1,800 to 3,500 Chinese characters.
- 1 to 2 code blocks for technical lessons.
- 1 exercise.
- 3 self-test questions.
- 2 to 4 related links.

The first lesson may be shorter because it is a route overview. The mini-project lesson may be longer because it includes file structure and multiple test cases.

---

## 5. File Structure

### 5.1 Create Files

Create:

- `src/content/docs/beginner-course/start-here.md`
- `src/content/docs/beginner-course/testdev-role-map.md`
- `src/content/docs/beginner-course/python-testing-minimum.md`
- `src/content/docs/beginner-course/pytest-first-test.md`
- `src/content/docs/beginner-course/http-api-basics.md`
- `src/content/docs/beginner-course/pytest-api-first-case.md`
- `src/content/docs/beginner-course/mock-login-mini-project.md`
- `src/content/docs/beginner-course/interview-expression-for-first-project.md`
- `src/lib/beginner-path.ts`
- `tests/unit/beginner-path.test.ts`

### 5.2 Modify Files

Modify:

- `src/content.config.ts`
- `src/lib/site-config.ts`
- `src/lib/home-page.ts`
- `src/components/HomePage.astro`
- `astro.config.mjs`
- `tests/unit/home-page.test.ts`
- `tests/e2e/navigation.spec.ts`
- `tests/e2e/content.spec.ts`
- `scripts/validate-content.ts`
- `tests/unit/content-validation.test.ts`
- `README.md`
- `PROJECT_DOC.md`
- `AGENTS.md`

### 5.3 File Responsibilities

`src/lib/beginner-path.ts`

- Defines beginner path metadata.
- Provides ordered lesson slugs.
- Provides helper functions for lesson lookup.

`src/content/docs/beginner-course/*.md`

- Stores the beginner MVP teaching content.
- Uses the same Starlight docs content collection as existing content.

`src/lib/site-config.ts`

- Adds the new category metadata.
- Sets `recommendedSlug: "start-here"` for beginner-course.

`src/lib/home-page.ts`

- Exposes beginner and interview homepage entry links.
- Keeps module links generated from site config.

`src/components/HomePage.astro`

- Adds dual entry section.
- Links beginner entry to beginner-course start page.

`astro.config.mjs`

- Adds beginner-course to Starlight sidebar.
- Reorders sidebar.

`scripts/validate-content.ts`

- Validates beginner lessons have required teaching sections.
- Validates beginner path slugs exist.

---

## 6. Metadata Design

### 6.1 Extend Category Enum

Add `beginner-course` to content category enum:

```ts
category: z.enum([
  "beginner-course",
  "glossary",
  "tech",
  "project",
  "scenario",
  "coding",
  "roadmap",
  "ai-learning",
  "practice-template",
  "interview-chains",
]),
```

### 6.2 Beginner Frontmatter Example

Every beginner lesson should follow this shape:

```yaml
---
title: "从零开始：测试开发学习路线"
description: "面向初学者的 7 天测试开发入门路径，先学会基础能力，再进入面试冲刺。"
category: "beginner-course"
difficulty: "beginner"
interviewWeight: 2
tags: ["新手教程", "测试开发入门", "学习路线"]
relatedSlugs:
  - "roadmap/3-day-interview-map"
  - "tech/api-testing"
selfTests:
  - id: "beginner-start-audience"
    question: "这条新手路线最适合哪类用户？"
    options:
      - "已经能独立设计复杂测试平台的人"
      - "刚开始学习测试开发，需要先建立基础路径的人"
      - "只想背诵面试答案的人"
      - "完全不需要练习的人"
    correctIndex: 1
    explanation: "新手路线面向刚开始学习测试开发的人，重点是先建立基础能力，再进入面试表达。"
---
```

### 6.3 Optional Future Metadata

Do not add these fields in the first task unless needed by UI:

- `stage`
- `estimatedMinutes`
- `pathIds`
- `prerequisites`
- `outcomes`

They are useful later, but the MVP can ship with existing schema plus `beginner-path.ts`.

---

## 7. Implementation Tasks

### Task 1: Add Beginner Category To Schema And Config

**Files:**

- Modify: `src/content.config.ts`
- Modify: `src/lib/site-config.ts`
- Modify: `astro.config.mjs`
- Test: `tests/unit/content-validation.test.ts`

- [ ] **Step 1: Write failing schema/config test**

Add this test to `tests/unit/content-validation.test.ts`:

```ts
it("accepts beginner-course as a first-class category", () => {
  const result = validateDocs([
    doc({
      rel: "beginner-course/start-here.md",
      category: "beginner-course",
      slug: "start-here",
      fullSlug: "beginner-course/start-here",
      data: {
        category: "beginner-course",
        selfTests: [
          {
            id: "beginner-category-smoke",
            question: "新手教程的目标是什么？",
            options: ["先学会基础能力", "只背面试题"],
            correctIndex: 0,
            explanation: "新手教程的目标是先学会基础能力，再进入面试表达。",
          },
        ],
      },
      body: [
        "## 你会学到什么",
        "## 为什么要学",
        "## 前置知识",
        "## 核心概念",
        "## 最小示例",
        "## 手把手练习",
        "## 检查标准",
        "## 常见错误",
        "## 面试怎么说",
        "## 下一步",
      ].join("\n\n"),
    }),
  ]);

  expect(result.errors).toEqual([]);
});
```

- [ ] **Step 2: Run the test to verify current behavior**

Run:

```bash
npm run test -- tests/unit/content-validation.test.ts
```

Expected result before implementation:

```text
FAIL or content schema/config does not yet support beginner-course in the real app
```

- [ ] **Step 3: Add beginner-course to content schema**

Modify `src/content.config.ts` category enum:

```ts
category: z.enum([
  "beginner-course",
  "glossary",
  "tech",
  "project",
  "scenario",
  "coding",
  "roadmap",
  "ai-learning",
  "practice-template",
  "interview-chains",
]),
```

- [ ] **Step 4: Add beginner-course to site config**

Add this item at the start of `categories` in `src/lib/site-config.ts`:

```ts
{
  id: "beginner-course",
  title: "新手教程",
  navLabel: "新手教程",
  description: "从零开始建立测试开发基础能力，再进入面试冲刺。",
  recommendedSlug: "start-here",
},
```

- [ ] **Step 5: Add beginner-course sidebar section**

In `astro.config.mjs`, place this section before `学习路线`:

```ts
{
  label: "新手教程",
  items: [{ autogenerate: { directory: "beginner-course" } }],
},
```

Also reorder existing sidebar so learning flow becomes:

```text
新手教程
学习路线
术语体系
技术专题
编码题
项目类型
场景题
面试追问链
练手模板
AI 学习指南
分类索引
```

- [ ] **Step 6: Run validation**

Run:

```bash
npm run typecheck
npm run test -- tests/unit/content-validation.test.ts
```

Expected:

```text
0 errors
content-validation.test.ts passes
```

- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts src/lib/site-config.ts astro.config.mjs tests/unit/content-validation.test.ts
git commit -m "feat: add beginner course category"
```

---

### Task 2: Create Beginner Path Data

**Files:**

- Create: `src/lib/beginner-path.ts`
- Create: `tests/unit/beginner-path.test.ts`

- [ ] **Step 1: Create failing beginner path tests**

Create `tests/unit/beginner-path.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  beginnerPath,
  getBeginnerLessonBySlug,
  getNextBeginnerLesson,
} from "../../src/lib/beginner-path";

describe("beginner path", () => {
  it("defines exactly eight ordered beginner lessons", () => {
    expect(beginnerPath.lessons.map((lesson) => lesson.slug)).toEqual([
      "start-here",
      "testdev-role-map",
      "python-testing-minimum",
      "pytest-first-test",
      "http-api-basics",
      "pytest-api-first-case",
      "mock-login-mini-project",
      "interview-expression-for-first-project",
    ]);
  });

  it("finds lessons by slug", () => {
    expect(getBeginnerLessonBySlug("pytest-first-test")).toMatchObject({
      slug: "pytest-first-test",
      day: 4,
    });
  });

  it("returns the next lesson", () => {
    expect(getNextBeginnerLesson("pytest-first-test")).toMatchObject({
      slug: "http-api-basics",
      day: 5,
    });
  });

  it("returns undefined after the final lesson", () => {
    expect(
      getNextBeginnerLesson("interview-expression-for-first-project"),
    ).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test -- tests/unit/beginner-path.test.ts
```

Expected:

```text
FAIL because src/lib/beginner-path.ts does not exist
```

- [ ] **Step 3: Create beginner path implementation**

Create `src/lib/beginner-path.ts`:

```ts
export interface BeginnerLesson {
  day: number;
  slug: string;
  title: string;
  goal: string;
  output: string;
  minutes: number;
}

export interface BeginnerPath {
  id: "beginner-7-day-api";
  title: string;
  description: string;
  audience: string;
  lessons: BeginnerLesson[];
}

export const beginnerPath: BeginnerPath = {
  id: "beginner-7-day-api",
  title: "7 天测试开发新手入门",
  description:
    "用 7 天理解测试开发基础，写出第一个 Pytest 接口自动化小项目，并学会用面试语言表达。",
  audience: "功能测试、零基础或刚开始学习自动化测试的用户",
  lessons: [
    {
      day: 1,
      slug: "start-here",
      title: "从零开始：测试开发学习路线",
      goal: "理解这条路线怎么学，以及学完能获得什么。",
      output: "写下自己的 7 天学习目标和每天练习时间。",
      minutes: 25,
    },
    {
      day: 2,
      slug: "testdev-role-map",
      title: "测试开发是什么：岗位能力地图",
      goal: "理解测试开发和功能测试、自动化测试、开发的区别。",
      output: "用 3 句话讲清测试开发的职责。",
      minutes: 35,
    },
    {
      day: 3,
      slug: "python-testing-minimum",
      title: "Python 测试最小基础",
      goal: "掌握写测试需要的最小 Python 知识。",
      output: "能读懂函数、字典、列表、条件判断和 assert。",
      minutes: 50,
    },
    {
      day: 4,
      slug: "pytest-first-test",
      title: "Pytest 第一个测试用例",
      goal: "写出第一个可运行的 Pytest 测试。",
      output: "运行一个通过用例和一个失败用例。",
      minutes: 50,
    },
    {
      day: 5,
      slug: "http-api-basics",
      title: "HTTP 和接口测试基础",
      goal: "理解请求、响应、状态码、JSON 和接口断言。",
      output: "能解释一次接口调用发生了什么。",
      minutes: 55,
    },
    {
      day: 6,
      slug: "pytest-api-first-case",
      title: "用 Pytest 写第一个接口测试",
      goal: "用代码请求接口并断言返回结果。",
      output: "写出一个最小接口测试用例。",
      minutes: 60,
    },
    {
      day: 7,
      slug: "mock-login-mini-project",
      title: "小项目：模拟登录接口测试",
      goal: "把前面知识串成一个小项目。",
      output: "完成登录成功、密码错误、缺少参数 3 条用例。",
      minutes: 90,
    },
    {
      day: 8,
      slug: "interview-expression-for-first-project",
      title: "面试表达：如何讲第一个接口自动化项目",
      goal: "把练习项目转成可面试表达。",
      output: "准备一段 2 分钟项目介绍。",
      minutes: 45,
    },
  ],
};

export function getBeginnerLessonBySlug(
  slug: string,
): BeginnerLesson | undefined {
  return beginnerPath.lessons.find((lesson) => lesson.slug === slug);
}

export function getNextBeginnerLesson(
  slug: string,
): BeginnerLesson | undefined {
  const index = beginnerPath.lessons.findIndex(
    (lesson) => lesson.slug === slug,
  );
  return index >= 0 ? beginnerPath.lessons[index + 1] : undefined;
}
```

- [ ] **Step 4: Run beginner path tests**

Run:

```bash
npm run test -- tests/unit/beginner-path.test.ts
```

Expected:

```text
4 tests passed
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/beginner-path.ts tests/unit/beginner-path.test.ts
git commit -m "feat: add beginner learning path data"
```

---

### Task 3: Create Eight Beginner Lessons

**Files:**

- Create: `src/content/docs/beginner-course/start-here.md`
- Create: `src/content/docs/beginner-course/testdev-role-map.md`
- Create: `src/content/docs/beginner-course/python-testing-minimum.md`
- Create: `src/content/docs/beginner-course/pytest-first-test.md`
- Create: `src/content/docs/beginner-course/http-api-basics.md`
- Create: `src/content/docs/beginner-course/pytest-api-first-case.md`
- Create: `src/content/docs/beginner-course/mock-login-mini-project.md`
- Create: `src/content/docs/beginner-course/interview-expression-for-first-project.md`

- [ ] **Step 1: Write the first lesson**

Create `src/content/docs/beginner-course/start-here.md` with this frontmatter:

```yaml
---
title: "从零开始：测试开发学习路线"
description: "面向初学者的 7 天测试开发入门路径，先学会基础能力，再进入面试冲刺。"
category: "beginner-course"
difficulty: "beginner"
interviewWeight: 2
tags: ["新手教程", "测试开发入门", "学习路线"]
relatedSlugs:
  - "beginner-course/testdev-role-map"
  - "roadmap/3-day-interview-map"
selfTests:
  - id: "beginner-start-audience"
    question: "这条新手路线最适合哪类用户？"
    options:
      - "已经能独立设计复杂测试平台的人"
      - "刚开始学习测试开发，需要先建立基础路径的人"
      - "只想背诵面试答案的人"
      - "完全不需要练习的人"
    correctIndex: 1
    explanation: "新手路线面向刚开始学习测试开发的人，重点是先建立基础能力，再进入面试表达。"
  - id: "beginner-start-method"
    question: "新手学习测试开发最重要的方法是什么？"
    options:
      - "只看概念"
      - "每节课都完成一个小练习"
      - "跳过基础直接背项目"
      - "只刷面试题"
    correctIndex: 1
    explanation: "初学者需要用练习建立真实能力。只看概念或只背答案很难形成自动化测试能力。"
  - id: "beginner-start-output"
    question: "这条路线的最终产出是什么？"
    options:
      - "一个接口自动化小项目和一段项目表达"
      - "一份无关简历"
      - "完整测试平台"
      - "前端页面设计稿"
    correctIndex: 0
    explanation: "MVP 路线的目标是完成一个小而完整的接口自动化练习项目，并能讲清楚它。"
---
```

Body must include all required teaching sections and the 8-lesson route table.

- [ ] **Step 2: Write lesson 2**

Create `src/content/docs/beginner-course/testdev-role-map.md`.

Required content:

- Explain functional testing, automation testing, test development, and backend development differences.
- Include a responsibility map.
- Exercise: write 3 sentences explaining test development.
- Interview expression point: "测试开发不是只写脚本，而是用工程能力提升质量效率。"
- Next link: `/testdev-interview-site/beginner-course/python-testing-minimum/`

- [ ] **Step 3: Write lesson 3**

Create `src/content/docs/beginner-course/python-testing-minimum.md`.

Required content:

- Functions.
- Lists and dictionaries.
- Conditions.
- `assert`.
- Exercise: write `is_success_response(response)` and assert 3 examples.
- Common mistakes: confusing `=` and `==`, ignoring data type, writing too much code before testing.
- Related links: `tech/python`, `glossary/api-assertion`.

- [ ] **Step 4: Write lesson 4**

Create `src/content/docs/beginner-course/pytest-first-test.md`.

Required content:

- Install and run Pytest.
- Test file naming.
- First passing test.
- First failing test.
- How failure messages help debugging.
- Exercise: write tests for `add(a, b)`.
- Related links: `tech/pytest`, `glossary/unit-testing`.

- [ ] **Step 5: Write lesson 5**

Create `src/content/docs/beginner-course/http-api-basics.md`.

Required content:

- Request method.
- URL.
- Query parameter.
- Header.
- Body.
- Status code.
- JSON response.
- Exercise: inspect a sample response and identify status, message, and data fields.
- Related links: `tech/api-testing`, `glossary/api-assertion`.

- [ ] **Step 6: Write lesson 6**

Create `src/content/docs/beginner-course/pytest-api-first-case.md`.

Required content:

- Use `requests` or explain a pseudo-client if not adding runtime dependency.
- Show minimal API test shape.
- Assert status code and response body.
- Exercise: test a public or mock endpoint.
- Common mistakes: only asserting 200, not checking business field, using sleep blindly.
- Related links: `tech/api-testing`, `coding/assertion-wrapper`.

Use this code sample:

```python
def test_login_success(api_client):
    response = api_client.post("/login", json={
        "username": "demo",
        "password": "correct-password",
    })

    assert response.status_code == 200
    assert response.json()["code"] == 0
    assert "token" in response.json()["data"]
```

- [ ] **Step 7: Write lesson 7**

Create `src/content/docs/beginner-course/mock-login-mini-project.md`.

Required content:

- Mini-project goal.
- Directory structure.
- Three test cases:
  - login success.
  - wrong password.
  - missing username.
- Assertion checklist.
- Exercise: add one more case for empty password.
- Related links: `practice-template/api-automation-template`, `scenario/login-auth`.

- [ ] **Step 8: Write lesson 8**

Create `src/content/docs/beginner-course/interview-expression-for-first-project.md`.

Required content:

- Convert the mini-project into project expression.
- 2-minute structure:
  - background.
  - goal.
  - implementation.
  - test cases.
  - result.
  - improvement.
- Exercise: record a 2-minute answer.
- Related links: `roadmap/self-introduction-template`, `practice-template/project-story-template`.

- [ ] **Step 9: Run content validation**

Run:

```bash
npm run validate:content
```

Expected:

```text
no ERROR output
```

- [ ] **Step 10: Run build**

Run:

```bash
npm run build
```

Expected:

```text
Complete!
```

- [ ] **Step 11: Commit**

```bash
git add src/content/docs/beginner-course
git commit -m "docs: add beginner teaching path lessons"
```

---

### Task 4: Validate Beginner Lesson Structure

**Files:**

- Modify: `scripts/validate-content.ts`
- Modify: `tests/unit/content-validation.test.ts`

- [ ] **Step 1: Write failing validation test**

Add this test:

```ts
it("requires beginner lessons to use the teaching section structure", () => {
  const result = validateDocs([
    doc({
      rel: "beginner-course/start-here.md",
      category: "beginner-course",
      slug: "start-here",
      fullSlug: "beginner-course/start-here",
      data: { category: "beginner-course" },
      body: "## 你会学到什么\n\n## 下一步",
    }),
  ]);

  expect(result.errors).toContain(
    'beginner-course/start-here.md: beginner lesson is missing section "## 为什么要学"',
  );
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm run test -- tests/unit/content-validation.test.ts
```

Expected:

```text
FAIL because beginner section validation is not implemented
```

- [ ] **Step 3: Implement beginner section validation**

Add this constant near the top of `scripts/validate-content.ts`:

```ts
const beginnerRequiredSections = [
  "## 你会学到什么",
  "## 为什么要学",
  "## 前置知识",
  "## 核心概念",
  "## 最小示例",
  "## 手把手练习",
  "## 检查标准",
  "## 常见错误",
  "## 面试怎么说",
  "## 下一步",
];
```

Inside the per-doc validation loop, add:

```ts
if (doc.category === "beginner-course") {
  for (const section of beginnerRequiredSections) {
    if (!doc.body.includes(section)) {
      errors.push(
        `${doc.rel}: beginner lesson is missing section "${section}"`,
      );
    }
  }
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm run test -- tests/unit/content-validation.test.ts
npm run validate:content
```

Expected:

```text
content-validation.test.ts passes
validate:content has no ERROR output
```

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-content.ts tests/unit/content-validation.test.ts
git commit -m "test: validate beginner lesson structure"
```

---

### Task 5: Add Homepage Dual Entry

**Files:**

- Modify: `src/lib/home-page.ts`
- Modify: `src/components/HomePage.astro`
- Modify: `tests/unit/home-page.test.ts`
- Modify: `tests/e2e/navigation.spec.ts`

- [ ] **Step 1: Add failing unit test**

In `tests/unit/home-page.test.ts`, add:

```ts
it("should expose beginner and interview entry links", () => {
  const { entryLinks } = getHomePageData("/testdev-interview-site/");

  expect(entryLinks).toEqual([
    {
      id: "beginner",
      href: "/testdev-interview-site/beginner-course/start-here/",
      title: "我是初学者：从零开始",
      description:
        "按 7 天路线建立测试开发基础，并完成第一个接口自动化小项目。",
    },
    {
      id: "interview",
      href: "/testdev-interview-site/roadmap/3-day-interview-map/",
      title: "我有基础：冲刺面试",
      description: "直接进入术语速记、项目表达、场景题和追问链。",
    },
  ]);
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm run test -- tests/unit/home-page.test.ts
```

Expected:

```text
FAIL because entryLinks does not exist
```

- [ ] **Step 3: Extend home-page data**

Modify `src/lib/home-page.ts`:

```ts
export interface HomePageEntryLink {
  id: "beginner" | "interview";
  href: string;
  title: string;
  description: string;
}
```

Update return type:

```ts
export function getHomePageData(base: string): {
  entryLinks: HomePageEntryLink[];
  roadmapLinks: HomePageLink[];
  moduleLinks: HomePageLink[];
};
```

Add:

```ts
entryLinks: [
  {
    id: "beginner",
    href: `${normalizedBase}beginner-course/start-here/`,
    title: "我是初学者：从零开始",
    description: "按 7 天路线建立测试开发基础，并完成第一个接口自动化小项目。",
  },
  {
    id: "interview",
    href: `${normalizedBase}roadmap/3-day-interview-map/`,
    title: "我有基础：冲刺面试",
    description: "直接进入术语速记、项目表达、场景题和追问链。",
  },
],
```

- [ ] **Step 4: Render dual entry cards**

Modify `src/components/HomePage.astro`:

```astro
const { entryLinks, roadmapLinks, moduleLinks } = getHomePageData(base);
```

Add a section after hero:

```astro
<section class="entry-section" aria-label="选择学习入口">
  <div class="section-header">
    <h2 class="section-title-home">选择你的学习方式</h2>
  </div>
  <div class="entry-grid">
    {entryLinks.map((entry) => (
      <a href={entry.href} class={`entry-card entry-card-${entry.id}`}>
        <h3>{entry.title}</h3>
        <p>{entry.description}</p>
      </a>
    ))}
  </div>
</section>
```

- [ ] **Step 5: Add CSS**

Add to `src/styles/home-page-v3.css`:

```css
.entry-section {
  margin: var(--space-2xl) 0;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

.entry-card {
  display: block;
  padding: var(--space-lg);
  border: 1px solid var(--sl-color-hairline);
  background: var(--sl-color-bg);
  color: var(--sl-color-white);
  text-decoration: none;
}

.entry-card h3 {
  margin: 0 0 var(--space-sm);
  font-size: 1.125rem;
}

.entry-card p {
  margin: 0;
  color: var(--sl-color-gray-2);
}

@media (max-width: 720px) {
  .entry-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Add E2E navigation check**

In `tests/e2e/navigation.spec.ts`, add:

```ts
test("homepage exposes beginner and interview paths", async ({ page }) => {
  await page.goto(appUrl("/"));

  await expect(page.getByRole("link", { name: /我是初学者/ })).toHaveAttribute(
    "href",
    `${BASE_PATH}/beginner-course/start-here/`,
  );

  await expect(page.getByRole("link", { name: /我有基础/ })).toHaveAttribute(
    "href",
    `${BASE_PATH}/roadmap/3-day-interview-map/`,
  );
});
```

- [ ] **Step 7: Run tests**

Run:

```bash
npm run test -- tests/unit/home-page.test.ts
npm run test:e2e -- tests/e2e/navigation.spec.ts --project=chromium
```

Expected:

```text
unit test passes
navigation E2E passes
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/home-page.ts src/components/HomePage.astro src/styles/home-page-v3.css tests/unit/home-page.test.ts tests/e2e/navigation.spec.ts
git commit -m "feat: add beginner homepage entry"
```

---

### Task 6: Connect Beginner Lessons To Existing Interview Content

**Files:**

- Modify: `src/content/docs/beginner-course/*.md`
- Modify: `tests/unit/content-validation.test.ts`

- [ ] **Step 1: Define required cross-links**

Each lesson must include these `relatedSlugs`:

```text
start-here -> beginner-course/testdev-role-map, roadmap/3-day-interview-map
testdev-role-map -> beginner-course/python-testing-minimum, roadmap/self-introduction-template
python-testing-minimum -> beginner-course/pytest-first-test, tech/python
pytest-first-test -> beginner-course/http-api-basics, tech/pytest
http-api-basics -> beginner-course/pytest-api-first-case, tech/api-testing, glossary/api-assertion
pytest-api-first-case -> beginner-course/mock-login-mini-project, coding/assertion-wrapper
mock-login-mini-project -> beginner-course/interview-expression-for-first-project, practice-template/api-automation-template, scenario/login-auth
interview-expression-for-first-project -> practice-template/project-story-template, interview-chains/api-testing-chain
```

- [ ] **Step 2: Add content validation test**

Add:

```ts
it("requires beginner lessons to have related next-step links", () => {
  const result = validateDocs([
    doc({
      rel: "beginner-course/start-here.md",
      category: "beginner-course",
      slug: "start-here",
      fullSlug: "beginner-course/start-here",
      data: { category: "beginner-course", relatedSlugs: [] },
      body: [
        "## 你会学到什么",
        "## 为什么要学",
        "## 前置知识",
        "## 核心概念",
        "## 最小示例",
        "## 手把手练习",
        "## 检查标准",
        "## 常见错误",
        "## 面试怎么说",
        "## 下一步",
      ].join("\n\n"),
    }),
  ]);

  expect(result.errors).toContain(
    "beginner-course/start-here.md: beginner lesson must include at least 2 relatedSlugs",
  );
});
```

- [ ] **Step 3: Implement validation**

In `scripts/validate-content.ts`, inside beginner-course block:

```ts
if ((doc.data.relatedSlugs ?? []).length < 2) {
  errors.push(
    `${doc.rel}: beginner lesson must include at least 2 relatedSlugs`,
  );
}
```

- [ ] **Step 4: Update all beginner lessons**

Ensure every beginner lesson frontmatter includes at least 2 `relatedSlugs`, using the mapping from Step 1.

- [ ] **Step 5: Run validation**

Run:

```bash
npm run validate:content
npm run test -- tests/unit/content-validation.test.ts
```

Expected:

```text
no validation errors
content-validation tests pass
```

- [ ] **Step 6: Commit**

```bash
git add scripts/validate-content.ts tests/unit/content-validation.test.ts src/content/docs/beginner-course
git commit -m "docs: connect beginner lessons to next steps"
```

---

### Task 7: Update Documentation

**Files:**

- Modify: `README.md`
- Modify: `PROJECT_DOC.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Update README positioning**

In `README.md`, add a section under project highlights:

```md
- 新手教学层：为零基础和功能测试转测开用户提供 7 天入门路径，从岗位认知、Python 最小基础、Pytest、HTTP、接口测试到小项目表达。
```

Add `beginner-course` to content structure list.

- [ ] **Step 2: Update PROJECT_DOC information architecture**

In `PROJECT_DOC.md`, update core coverage list to include:

```md
- 新手教程
```

In key interactions, add:

```md
### 新手教学路径

- 使用 beginner-course 提供课程化内容
- 每节包含概念、示例、练习、检查标准和面试表达
- 与现有面试冲刺内容通过 relatedSlugs 连接
```

- [ ] **Step 3: Update AGENTS guidance**

In `AGENTS.md`, update category count and list:

```md
The site currently organizes content across 10 categories: beginner-course, glossary, tech, project, scenario, coding, roadmap, ai-learning, practice-template, and interview-chains.
```

Add note:

```md
Beginner-course content should keep a teaching-first structure: one core concept, one minimal example, one guided exercise, one common mistake, one interview expression point, and one next-step link.
```

- [ ] **Step 4: Run docs formatting**

Run:

```bash
npx prettier --check README.md PROJECT_DOC.md AGENTS.md
```

Expected:

```text
All matched files use Prettier code style!
```

- [ ] **Step 5: Commit**

```bash
git add README.md PROJECT_DOC.md AGENTS.md
git commit -m "docs: document beginner teaching layer"
```

---

### Task 8: Add Regression Coverage

**Files:**

- Modify: `tests/e2e/navigation.spec.ts`
- Modify: `tests/e2e/content.spec.ts`

- [ ] **Step 1: Add beginner page sample to navigation test**

In `tests/e2e/navigation.spec.ts`, add to `SAMPLE_PAGES`:

```ts
"/beginner-course/start-here/",
```

- [ ] **Step 2: Add beginner lesson rendering test**

In `tests/e2e/content.spec.ts`, add:

```ts
test("beginner lessons render the teaching structure", async ({ page }) => {
  await page.goto(appUrl("/beginner-course/start-here/"));

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "从零开始",
  );
  await expect(
    page.getByRole("heading", { name: "你会学到什么" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "手把手练习" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "面试怎么说" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "下一步" })).toBeVisible();
});
```

- [ ] **Step 3: Run E2E smoke**

Run:

```bash
npm run test:e2e:smoke
```

Expected:

```text
all Chromium smoke tests pass
```

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/navigation.spec.ts tests/e2e/content.spec.ts
git commit -m "test: cover beginner teaching flow"
```

---

### Task 9: Final Verification And Push

**Files:**

- Verify all changed files.

- [ ] **Step 1: Run full local gate**

Run:

```bash
npm run check
```

Expected:

```text
format passes
lint passes
typecheck passes
content validation passes
unit tests pass
build completes
```

- [ ] **Step 2: Run smoke E2E**

Run:

```bash
npm run test:e2e:smoke
```

Expected:

```text
all Chromium smoke tests pass
```

- [ ] **Step 3: Inspect diff**

Run:

```bash
git status --short --branch
git log --oneline -8
```

Expected:

```text
main branch contains the beginner teaching commits
working tree has no unexpected files
```

- [ ] **Step 4: Push**

Run:

```bash
git push origin main
```

Expected:

```text
main -> main
```

- [ ] **Step 5: Watch GitHub Pages**

Run:

```bash
gh run list --branch main --limit 3 --json databaseId,displayTitle,status,conclusion,headSha,url
gh run watch <latest-run-id> --exit-status
```

Expected:

```text
Deploy to GitHub Pages succeeds
build and deploy jobs are green
```

- [ ] **Step 6: Verify online homepage**

Run:

```powershell
$response = Invoke-WebRequest -Uri "https://muyuq.github.io/testdev-interview-site/" -UseBasicParsing -TimeoutSec 30
"StatusCode=$($response.StatusCode) Length=$($response.Content.Length)"
```

Expected:

```text
StatusCode=200
```

---

## 8. Content Writing Requirements

### 8.1 Voice

Beginner lessons should be direct, encouraging, and concrete. Avoid sounding like a dense interview answer. Use short examples before abstract explanation.

Good:

```text
你可以把接口测试理解成：不打开页面，直接和后端服务对话。
```

Avoid:

```text
接口测试是多层质量保障体系中用于验证服务间契约、业务副作用与链路状态一致性的关键手段。
```

The second sentence can appear later as interview expression, but not as the first explanation for beginners.

### 8.2 Exercise Style

Every exercise should include:

- What to create.
- What to run.
- Expected output.
- How to know it is correct.

Example:

````md
## 手把手练习

新建 `test_math.py`：

```python
def add(a, b):
    return a + b

def test_add_two_numbers():
    assert add(1, 2) == 3
```
````

运行：

```bash
pytest test_math.py
```

你应该看到 `1 passed`。

````

### 8.3 Interview Bridge

Every lesson must have a short interview bridge:

```md
## 面试怎么说

如果面试官问“你怎么理解接口测试”，可以这样回答：

“接口测试不依赖页面，直接验证后端接口的输入输出和业务结果。我会先看接口文档，确认请求方法、参数、鉴权和返回结构，再从状态码、响应字段、业务状态和异常场景几个层次设计断言。”
````

### 8.4 Next Step

Every lesson must end with:

```md
## 下一步

- 下一节：[标题](/testdev-interview-site/beginner-course/next-slug/)
- 延伸阅读：[标题](/testdev-interview-site/tech/some-topic/)
```

---

## 9. Risks And Controls

### 9.1 Risk: Beginner Course Becomes Too Large

Control:

- Ship exactly 8 lessons first.
- Do not add Playwright beginner course in this MVP.
- Do not add full project repository in this MVP.

### 9.2 Risk: Beginner Content Still Reads Like Interview Notes

Control:

- Enforce required teaching sections.
- Keep each lesson to one core concept.
- Put interview language after the exercise, not before.

### 9.3 Risk: New Category Breaks Navigation

Control:

- Add category to schema, site config, sidebar, tests.
- Add E2E page sample.
- Run full build.

### 9.4 Risk: Existing Users Lose Fast Interview Entry

Control:

- Keep 3-day and 7-day routes.
- Homepage has both beginner and interview entry cards.
- Existing module cards remain available.

### 9.5 Risk: Content Links Break On GitHub Pages

Control:

- Continue using `/testdev-interview-site/...` in Markdown links.
- Rely on existing Markdown internal link validation.
- Add beginner links to validation coverage.

---

## 10. Rollout Plan

### Phase 1: Structure

Tasks:

- Task 1: Add category.
- Task 2: Add path data.

Result:

- Site can recognize beginner-course.
- Ordered path exists in code.

### Phase 2: Content

Tasks:

- Task 3: Add 8 lessons.
- Task 4: Validate lesson structure.
- Task 6: Connect lessons to existing content.

Result:

- Beginner path is readable and has learning continuity.
- Each lesson has consistent teaching structure.

### Phase 3: Product Entry

Tasks:

- Task 5: Add homepage dual entry.
- Task 7: Update docs.

Result:

- New users can clearly choose beginner path.
- Maintainers know how to write beginner-course content.

### Phase 4: Verification

Tasks:

- Task 8: Add regression coverage.
- Task 9: Full verification and push.

Result:

- The path is covered by unit, content, build, and E2E checks.

---

## 11. Acceptance Checklist

- [ ] `beginner-course` exists in `src/content.config.ts`.
- [ ] `beginner-course` exists in `src/lib/site-config.ts`.
- [ ] Starlight sidebar includes `新手教程`.
- [ ] Homepage has beginner and interview entry cards.
- [ ] 8 beginner lessons exist under `src/content/docs/beginner-course/`.
- [ ] Each beginner lesson has the required 10 teaching sections.
- [ ] Each beginner lesson has 3 self-tests.
- [ ] Each beginner lesson has at least 2 related links.
- [ ] `src/lib/beginner-path.ts` defines exactly 8 ordered lessons.
- [ ] Unit tests cover beginner path data.
- [ ] Content validation covers beginner lesson structure.
- [ ] E2E covers beginner homepage entry and beginner lesson rendering.
- [ ] README, PROJECT_DOC, and AGENTS mention beginner-course.
- [ ] `npm run check` passes.
- [ ] `npm run test:e2e:smoke` passes.
- [ ] GitHub Pages deploy succeeds.
- [ ] Online homepage returns HTTP 200.

---

## 12. Future Expansion After MVP

After this beginner MVP works, add follow-up plans in this order:

1. Beginner Playwright path.
2. Beginner UI automation mini-project.
3. Beginner CI/CD lesson with GitHub Actions.
4. Downloadable or copyable mini-project files.
5. Module progress dashboard.
6. Bookmark list page.
7. Search and tag improvements for beginner lessons.
8. More open-ended practice prompts.

These should be separate implementation plans. They should not be merged into the first MVP.

---

## 13. Self-Review

### Spec Coverage

- Beginner positioning is covered by Sections 1, 2, and 3.
- Eight-lesson MVP is covered by Sections 4 and Task 3.
- Homepage dual entry is covered by Task 5.
- Existing interview content handoff is covered by Task 6.
- Validation and testing are covered by Tasks 4, 8, and 9.
- Documentation updates are covered by Task 7.

### Red-Flag Scan

This plan avoids unspecified gaps. Every task lists concrete files, concrete snippets, commands, and expected results.

### Scope Check

The first implementation scope is intentionally limited to one beginner teaching path. Playwright, CI/CD, full project repositories, and advanced practice systems are listed as future expansion rather than included in this MVP.
