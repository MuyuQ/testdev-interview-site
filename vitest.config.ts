// Vitest 配置
import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig({
  // 继承 Astro 的 Vite 配置
  ...getViteConfig({
    mode: 'test',
  }),

  test: {
    // 测试环境
    environment: 'node',

    // 全局设置文件
    setupFiles: ['./tests/setup.ts'],

    // 包含的测试文件
    include: ['tests/unit/**/*.test.ts'],

    // 排除的文件
    exclude: ['node_modules/**', 'dist/**', '.astro/**'],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/lib/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
    },

    // 超时配置
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});