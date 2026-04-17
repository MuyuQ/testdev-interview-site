import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://muyuq.github.io",
  base: "/testdev-interview-site",
  integrations: [
    starlight({
      title: "测试开发面试速成站",
      head: [
        // Robots meta tag
        {
          tag: "meta",
          attrs: {
            name: "robots",
            content:
              "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
        },
        // Canonical URL (Starlight auto-generates from site + base)
        {
          tag: "link",
          attrs: {
            rel: "canonical",
            href: "https://muyuq.github.io/testdev-interview-site/",
          },
        },
        // Open Graph - Site name
        {
          tag: "meta",
          attrs: {
            property: "og:site_name",
            content: "测试开发面试速成站",
          },
        },
        // Open Graph - Locale
        {
          tag: "meta",
          attrs: {
            property: "og:locale",
            content: "zh_CN",
          },
        },
        // Open Graph - Type
        {
          tag: "meta",
          attrs: {
            property: "og:type",
            content: "website",
          },
        },
        // Open Graph - Image
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content:
              "https://muyuq.github.io/testdev-interview-site/og-image.png",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:width",
            content: "1200",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:height",
            content: "630",
          },
        },
        // Twitter Card
        {
          tag: "meta",
          attrs: {
            name: "twitter:card",
            content: "summary_large_image",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:title",
            content: "测试开发面试速成站",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:description",
            content: "结构化内容帮助你快速补齐测试开发知识框架",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content:
              "https://muyuq.github.io/testdev-interview-site/og-image.png",
          },
        },
        // Google Fonts
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
      disable404Route: false,
      components: {
        Banner: "./src/components/Banner.astro",
        Pagination: "./src/components/Pagination.astro",
        Header: "./src/components/Header.astro",
        ContentPanel: "./src/components/CustomContentPanel.astro",
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
          label: "面试追问链",
          autogenerate: { directory: "interview-chains" },
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
