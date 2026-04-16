export interface CategoryConfig {
  id: string;
  title: string;
  navLabel: string;
  description: string;
  recommendedSlug?: string;
}

export const categories: CategoryConfig[] = [
  {
    id: "glossary",
    title: "术语体系",
    navLabel: "术语",
    description: "定义、重要性、易错点、混淆术语和回答提示",
    recommendedSlug: "api-assertion",
  },
  {
    id: "tech",
    title: "技术专题",
    navLabel: "技术专题",
    description: "Python、Pytest、Playwright、接口测试与CI/CD",
    recommendedSlug: "pytest",
  },
  {
    id: "project",
    title: "项目类型",
    navLabel: "项目类型",
    description: "按业务流程、风险点、测试策略组织项目经验",
    recommendedSlug: "payment-callback",
  },
  {
    id: "scenario",
    title: "场景题",
    navLabel: "场景题",
    description: "围绕典型面试追问沉淀标准回答骨架",
    recommendedSlug: "payment-callback",
  },
  {
    id: "coding",
    title: "编码题",
    navLabel: "编码题",
    description: "重试、缓存、日志、断言、Fixture等高频代码题",
    recommendedSlug: "retry-mechanism",
  },
  {
    id: "roadmap",
    title: "学习路线与面试打法",
    navLabel: "路线与打法",
    description: "3天/7天路线、自我介绍和项目表达模板",
    recommendedSlug: "3-day-interview-map",
  },
  {
    id: "ai-learning",
    title: "AI时代成长指南",
    navLabel: "AI成长",
    description: "AI对测试开发的影响",
    recommendedSlug: "ai-test-generation",
  },
  {
    id: "practice-template",
    title: "练手模板库",
    navLabel: "模板库",
    description: "工程练手模板和面试表达模板",
    recommendedSlug: "project-story-template",
  },
];

export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories.find((c) => c.id === id);
}

export function getAllCategoryIds(): string[] {
  return categories.map((c) => c.id);
}
