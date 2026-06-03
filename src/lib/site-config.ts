// 站点配置 - 10 个内容类别
// 按照 MODULE_CONTENT_ORGANIZATION_GUIDE.md 的顺序排列

export interface CategoryConfig {
  id: string;
  title: string;
  navLabel: string;
  description: string;
  recommendedSlug: string;
}

// 10 个类别配置（按规划文件推荐顺序）
export const categories: CategoryConfig[] = [
  {
    id: 'beginner-course',
    title: '新手教程',
    navLabel: '新手教程',
    description: '从零开始建立测试开发基础能力，再进入面试冲刺。',
    recommendedSlug: 'start-here',
  },
  {
    id: 'roadmap',
    title: '学习路线',
    navLabel: '学习路线',
    description: '提供时间盒学习路线和复盘方法。',
    recommendedSlug: '3-day-interview-map',
  },
  {
    id: 'glossary',
    title: '术语体系',
    navLabel: '术语体系',
    description: '建立共同语言，降低阅读其他模块的门槛。',
    recommendedSlug: 'api-assertion',
  },
  {
    id: 'tech',
    title: '技术专题',
    navLabel: '技术专题',
    description: '解释测试开发技术，并连接项目落地。',
    recommendedSlug: 'pytest',
  },
  {
    id: 'coding',
    title: '编码题',
    navLabel: '编码题',
    description: '训练小型工程能力和面试代码表达。',
    recommendedSlug: 'retry-mechanism',
  },
  {
    id: 'project',
    title: '项目类型',
    navLabel: '项目类型',
    description: '把技术能力包装成可讲述的项目经验。',
    recommendedSlug: 'ecommerce-project',
  },
  {
    id: 'scenario',
    title: '场景题',
    navLabel: '场景题',
    description: '训练真实业务风险分析和测试设计。',
    recommendedSlug: 'payment-callback',
  },
  {
    id: 'interview-chains',
    title: '面试追问链',
    navLabel: '面试追问链',
    description: '模拟连续追问，训练回答深度和抗压能力。',
    recommendedSlug: 'api-testing-chain',
  },
  {
    id: 'practice-template',
    title: '练手模板',
    navLabel: '练手模板',
    description: '提供可复用练习产物和面试素材模板。',
    recommendedSlug: 'project-story-template',
  },
  {
    id: 'ai-learning',
    title: 'AI学习指南',
    navLabel: 'AI学习指南',
    description: '解释 AI 时代测试开发的工具、边界和机会。',
    recommendedSlug: 'testdev-ai-tools',
  },
];

// 获取类别配置
export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories.find((c) => c.id === id);
}

// 获取所有类别 ID
export function getAllCategoryIds(): string[] {
  return categories.map((c) => c.id);
}

// 四层信息架构
export const layers = [
  {
    name: '入门教学层',
    categories: ['beginner-course', 'glossary', 'roadmap'],
  },
  {
    name: '技术能力层',
    categories: ['tech', 'coding', 'practice-template'],
  },
  {
    name: '项目和场景层',
    categories: ['project', 'scenario'],
  },
  {
    name: '面试表达层',
    categories: ['interview-chains', 'ai-learning'],
  },
];