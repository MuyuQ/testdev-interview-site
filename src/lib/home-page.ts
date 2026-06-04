// 首页数据层
// 提供首页所需的所有数据

import { categories, layers } from './site-config';

// 入口链接类型
export interface HomePageEntryLink {
  id: 'beginner' | 'interview';
  href: string;
  title: string;
  description: string;
}

// 模块链接类型
export interface HomePageModuleLink {
  id: string;
  href: string;
  title: string;
  description: string;
}

export interface HomePagePathStep {
  slug: string;
  href: string;
  title: string;
  outcome: string;
  minutes: number;
}

export interface HomePageCapabilityLayer {
  name: string;
  modules: HomePageModuleLink[];
}

// 首页数据类型
export interface HomePageData {
  entryLinks: HomePageEntryLink[];
  moduleLinks: HomePageModuleLink[];
  beginnerPath: HomePagePathStep[];
  capabilityLayers: HomePageCapabilityLayer[];
}

// 规范化 base path
function normalizeBase(base: string): string {
  if (!base) return '/';
  return base.endsWith('/') ? base : `${base}/`;
}

// 获取首页数据
export function getHomePageData(base: string): HomePageData {
  const normalizedBase = normalizeBase(base);

  // 双入口链接
  const entryLinks: HomePageEntryLink[] = [
    {
      id: 'beginner',
      href: `${normalizedBase}beginner-course/start-here/`,
      title: '我是初学者：从零开始',
      description:
        '按 7 天路线建立测试开发基础，并完成第一个接口自动化小项目。',
    },
    {
      id: 'interview',
      href: `${normalizedBase}roadmap/3-day-interview-map/`,
      title: '我有基础：冲刺面试',
      description: '直接进入术语速记、项目表达、场景题和追问链。',
    },
  ];

  // 模块链接（从 site-config 生成）
  const moduleLinks: HomePageModuleLink[] = categories.map((cat) => ({
    id: cat.id,
    href: `${normalizedBase}${cat.id}/`,
    title: cat.navLabel,
    description: cat.description,
  }));

  const beginnerPath: HomePagePathStep[] = [
    {
      slug: 'start-here',
      href: `${normalizedBase}beginner-course/start-here/`,
      title: '从零开始：测试开发学习路线',
      outcome: '写下 7 天学习计划',
      minutes: 25,
    },
    {
      slug: 'testdev-role-map',
      href: `${normalizedBase}beginner-course/testdev-role-map/`,
      title: '测试开发岗位认知',
      outcome: '用 3 句话讲清岗位职责',
      minutes: 35,
    },
    {
      slug: 'python-testing-minimum',
      href: `${normalizedBase}beginner-course/python-testing-minimum/`,
      title: 'Python 测试最小基础',
      outcome: '读懂函数、字典和断言',
      minutes: 50,
    },
    {
      slug: 'pytest-first-test',
      href: `${normalizedBase}beginner-course/pytest-first-test/`,
      title: 'Pytest 第一个测试用例',
      outcome: '运行通过和失败的用例',
      minutes: 50,
    },
    {
      slug: 'http-api-basics',
      href: `${normalizedBase}beginner-course/http-api-basics/`,
      title: 'HTTP 和接口测试基础',
      outcome: '解释一次接口调用',
      minutes: 55,
    },
    {
      slug: 'pytest-api-first-case',
      href: `${normalizedBase}beginner-course/pytest-api-first-case/`,
      title: '用 Pytest 写第一个接口测试',
      outcome: '写出一个最小接口用例',
      minutes: 60,
    },
    {
      slug: 'mock-login-mini-project',
      href: `${normalizedBase}beginner-course/mock-login-mini-project/`,
      title: '小项目：模拟登录接口测试',
      outcome: '完成 3 条登录测试用例',
      minutes: 90,
    },
    {
      slug: 'interview-expression-for-first-project',
      href: `${normalizedBase}beginner-course/interview-expression-for-first-project/`,
      title: '面试表达：如何讲第一个项目',
      outcome: '准备 2 分钟项目介绍',
      minutes: 45,
    },
  ];

  const capabilityLayers: HomePageCapabilityLayer[] = layers.map((layer) => ({
    name: layer.name,
    modules: layer.categories
      .map((categoryId) => moduleLinks.find((module) => module.id === categoryId))
      .filter((module): module is HomePageModuleLink => Boolean(module)),
  }));

  return {
    entryLinks,
    moduleLinks,
    beginnerPath,
    capabilityLayers,
  };
}
