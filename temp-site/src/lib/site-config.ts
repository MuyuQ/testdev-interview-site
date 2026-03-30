import type { TopicCategory } from "@/content/types";

export const orderedCategories: TopicCategory[] = [
  "glossary",
  "tech",
  "project",
  "scenario",
  "coding",
  "roadmap",
  "ai-learning",
  "practice-template",
];

type CategoryConfig = {
  title: string;
  navLabel: string;
  homeLabel: string;
  description: string;
  href: string;
};

export const categoryConfig: Record<TopicCategory, CategoryConfig> = {
  glossary: {
    title: "术语体系",
    navLabel: "术语",
    homeLabel: "术语体系",
    description: "定义、重要性、易错点、混淆术语和回答提示。",
    href: "/glossary",
  },
  tech: {
    title: "技术专题",
    navLabel: "技术专题",
    homeLabel: "技术专题",
    description: "围绕 Python、Pytest、Playwright、接口测试与 CI/CD 组织内容。",
    href: "/tech",
  },
  project: {
    title: "项目类型",
    navLabel: "项目类型",
    homeLabel: "项目类型",
    description: "按业务流程、风险点、测试策略和可讲成果组织项目经验。",
    href: "/project",
  },
  scenario: {
    title: "场景题",
    navLabel: "场景题",
    homeLabel: "场景题",
    description: "围绕典型面试追问沉淀标准回答骨架。",
    href: "/scenario",
  },
  coding: {
    title: "编码题",
    navLabel: "编码题",
    homeLabel: "编码题",
    description: "聚焦重试、缓存、日志、断言、Fixture 等高频代码题。",
    href: "/coding",
  },
  roadmap: {
    title: "学习路线与面试打法",
    navLabel: "路线与打法",
    homeLabel: "学习路线",
    description: "3 天 / 7 天路线、自我介绍和项目表达模板。",
    href: "/roadmap",
  },
  "ai-learning": {
    title: "AI 时代成长指南",
    navLabel: "AI 成长",
    homeLabel: "AI 成长",
    description: "围绕学习路径、应用边界和项目表达来理解 AI 对测试开发的影响。",
    href: "/ai-learning",
  },
  "practice-template": {
    title: "练手模板库",
    navLabel: "模板库",
    homeLabel: "练手模板",
    description: "提供工程练手模板和面试表达模板，帮助快速上手。",
    href: "/practice-template",
  },
};

export function isTopicCategory(value: string): value is TopicCategory {
  return orderedCategories.includes(value as TopicCategory);
}

