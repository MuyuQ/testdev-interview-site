// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages 配置
  site: 'https://muyuq.github.io',
  base: '/testdev-interview-site',

  integrations: [
    starlight({
      title: '测试开发面试速成站',
      description: '帮助用户在短时间内补齐测试开发面试知识，并把知识转化成可表达、可练习、可复盘的面试能力',

      // 社交链接
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/MuyuQ/testdev-interview-site' },
      ],

      // 多语言配置（中文为主）
      defaultLocale: 'zh',
      locales: {
        zh: { label: '简体中文' },
      },

      // 侧边栏配置（按规划文件推荐顺序）
      sidebar: [
        // 1. 新手教程（按学习顺序手动排列）
        {
          label: '新手教程',
          items: [
            { label: '从零开始：学习路线', link: '/beginner-course/start-here' },
            { label: '测试开发岗位认知', link: '/beginner-course/testdev-role-map' },
            { label: 'Python 最小基础', link: '/beginner-course/python-testing-minimum' },
            { label: 'Pytest 第一个测试', link: '/beginner-course/pytest-first-test' },
            { label: 'HTTP 接口基础', link: '/beginner-course/http-api-basics' },
            { label: '第一个接口测试', link: '/beginner-course/pytest-api-first-case' },
            { label: '登录小项目', link: '/beginner-course/mock-login-mini-project' },
            { label: '面试表达：讲项目', link: '/beginner-course/interview-expression-for-first-project' },
          ],
        },
        // 2. 学习路线
        {
          label: '学习路线',
          items: [{ autogenerate: { directory: 'roadmap' } }],
        },
        // 3. 术语体系
        {
          label: '术语体系',
          items: [{ autogenerate: { directory: 'glossary' } }],
        },
        // 4. 技术专题
        {
          label: '技术专题',
          items: [{ autogenerate: { directory: 'tech' } }],
        },
        // 5. 编码题
        {
          label: '编码题',
          items: [{ autogenerate: { directory: 'coding' } }],
        },
        // 6. 项目类型
        {
          label: '项目类型',
          items: [{ autogenerate: { directory: 'project' } }],
        },
        // 7. 场景题
        {
          label: '场景题',
          items: [{ autogenerate: { directory: 'scenario' } }],
        },
        // 8. 面试追问链
        {
          label: '面试追问链',
          items: [{ autogenerate: { directory: 'interview-chains' } }],
        },
        // 9. 练手模板
        {
          label: '练手模板',
          items: [{ autogenerate: { directory: 'practice-template' } }],
        },
        // 10. AI 学习指南
        {
          label: 'AI 学习指南',
          items: [{ autogenerate: { directory: 'ai-learning' } }],
        },
      ],

      // 自定义 CSS
      customCss: [
        '/src/styles/design-system-v3.css',
        '/src/styles/starlight-overrides-v3.css',
        '/src/styles/home-page-v3.css',
        '/src/styles/components-v3.css',
        '/src/styles/layout-v3.css',
      ],
    }),
  ],

  // 构建输出目录
  outDir: 'dist',

  // 预渲染所有页面
  output: 'static',
});