// 首页数据层
// 提供首页所需的所有数据

import { categories } from './site-config';

// 入口链接类型
export interface HomePageEntryLink {
  id: 'beginner' | 'interview';
  href: string;
  title: string;
  description: string;
}

// 模块链接类型
export interface HomePageModuleLink {
  href: string;
  title: string;
  description: string;
}

// 首页数据类型
export interface HomePageData {
  entryLinks: HomePageEntryLink[];
  moduleLinks: HomePageModuleLink[];
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
    href: `${normalizedBase}${cat.id}/`,
    title: cat.navLabel,
    description: cat.description,
  }));

  return {
    entryLinks,
    moduleLinks,
  };
}