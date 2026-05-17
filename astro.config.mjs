import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://muyuq.github.io",
  base: "/testdev-interview-site",
  integrations: [
    starlight({
      title: "测试开发面试速成站",
      defaultLocale: "root",
      locales: {
        root: {
          label: "简体中文",
          lang: "zh-CN",
        },
      },
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
      ],
      customCss: [
        // 全新设计系统（v3.0）- 有机现代主义
        "./src/styles/design-system-v3.css",
        "./src/styles/components-v3.css",
        "./src/styles/layout-v3.css",
        "./src/styles/home-page-v3.css",
        "./src/styles/starlight-overrides-v3.css",
      ],
      disable404Route: false,
      components: {
        Banner: "./src/components/Banner.astro",
        Pagination: "./src/components/Pagination.astro",
        Header: "./src/components/Header.astro",
        ContentPanel: "./src/components/CustomContentPanel.astro",
        ThemeProvider: "./src/components/ThemeProvider.astro",
      },
      sidebar: [
        {
          label: "术语体系",
          items: [{ autogenerate: { directory: "glossary" } }],
        },
        {
          label: "技术专题",
          items: [{ autogenerate: { directory: "tech" } }],
        },
        {
          label: "项目类型",
          items: [{ autogenerate: { directory: "project" } }],
        },
        {
          label: "场景题",
          items: [{ autogenerate: { directory: "scenario" } }],
        },
        {
          label: "编码题",
          items: [{ autogenerate: { directory: "coding" } }],
        },
        {
          label: "学习路线",
          items: [{ autogenerate: { directory: "roadmap" } }],
        },
        {
          label: "AI 学习指南",
          items: [{ autogenerate: { directory: "ai-learning" } }],
        },
        {
          label: "练手模板",
          items: [{ autogenerate: { directory: "practice-template" } }],
        },
        {
          label: "面试追问链",
          items: [{ autogenerate: { directory: "interview-chains" } }],
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
