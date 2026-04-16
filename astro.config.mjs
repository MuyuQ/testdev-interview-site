import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://muyuq.github.io",
  base: "/TestDev-Sprint",
  integrations: [
    starlight({
      title: "测试开发面试速成站",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: "true",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap",
          },
        },
        {
          tag: "style",
          content: `
            :root[data-theme="dark"] { background-color: #0c0e12 !important; }
            :root[data-theme="dark"] body { background-color: #0c0e12 !important; }
            :root[data-theme="light"] header, :root[data-theme="light"] .header { background-color: #ffffff !important; }
          `,
        },
        {
          tag: "script",
          attrs: {
            "is:inline": true,
          },
          content: `
            (function() {
              try {
                var theme = localStorage.getItem('testdev:theme');
                if (!theme || theme === 'auto') {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                var bgColor = theme === 'dark' ? '#0c0e12' : '#ffffff';
                document.documentElement.style.setProperty('background-color', bgColor, 'important');
                document.body.style.setProperty('background-color', bgColor, 'important');
              } catch(e) {}
            })();
            document.addEventListener('astro:page-load', function() {
              try {
                var theme = localStorage.getItem('testdev:theme');
                if (!theme || theme === 'auto') {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                var bgColor = theme === 'dark' ? '#0c0e12' : '#ffffff';
                document.documentElement.style.setProperty('background-color', bgColor, 'important');
                document.body.style.setProperty('background-color', bgColor, 'important');
              } catch(e) {}
            });
          `,
        },
      ],
      customCss: [
        "./src/styles/tokens.css",
        "./src/styles/custom-layout.css",
        "./src/styles/components.css",
        "./src/styles/tabs-custom.css",
      ],
      disable404Route: true,
      components: {
        Banner: "./src/components/Banner.astro",
        Pagination: "./src/components/Pagination.astro",
        Header: "./src/components/Header.astro",
      },
      sidebar: [
        {
          label: "术语体系",
          autogenerate: { directory: "glossary" },
        },
        {
          label: "技术专题",
          autogenerate: { directory: "tech" },
        },
        {
          label: "项目类型",
          autogenerate: { directory: "project" },
        },
        {
          label: "场景题",
          autogenerate: { directory: "scenario" },
        },
        {
          label: "编码题",
          autogenerate: { directory: "coding" },
        },
        {
          label: "学习路线",
          autogenerate: { directory: "roadmap" },
        },
        {
          label: "AI 学习指南",
          autogenerate: { directory: "ai-learning" },
        },
        {
          label: "练手模板",
          autogenerate: { directory: "practice-template" },
        },
        {
          label: "分类索引",
          items: [
            { label: "标签", link: "/tags/" },
            { label: "难度", link: "/difficulty/" },
          ],
        },
      ],
    }),
  ],
});
