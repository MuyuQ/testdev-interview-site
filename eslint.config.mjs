// eslint.config.mjs
// @ts-check

import eslint from "@eslint/js";
import astroPlugin from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // eslint-plugin-astro 的推荐配置是扁平配置数组,必须展开数组而不是混入对象
  ...astroPlugin.configs.recommended,
  {
    files: ["**/*.astro"],
    rules: {
      "astro/no-set-html-directive": "off",
    },
  },
  {
    // scripts 目录是 Node 脚本,允许 console/process 等全局量
    files: ["scripts/**/*.mjs", "scripts/**/*.ts"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "temp-site/**",
      ".astro/**",
      "public/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
);
