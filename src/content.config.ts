// 内容集合配置
// 扩展 Starlight docsSchema，添加测试开发面试站点自定义元数据

import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// 自定义元数据 Schema
const testdevMetadataSchema = z.object({
  // 难度级别
  difficulty: z.enum(['beginner', 'interview']).optional(),

  // 面试权重（1-3，越高越重要）
  interviewWeight: z.number().min(1).max(3).optional(),

  // 内容类别（10个模块）- 首页等特殊页面不需要此字段
  category: z.enum([
    'beginner-course',
    'glossary',
    'tech',
    'project',
    'scenario',
    'coding',
    'roadmap',
    'ai-learning',
    'practice-template',
    'interview-chains',
  ]).optional(),

  // 标签（3-6个）
  tags: z.array(z.string()).default([]),

  // 关联内容 slug
  relatedSlugs: z.array(z.string()).default([]),

  // 自测题
  selfTests: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      options: z.array(z.string()).min(2).max(4),
      correctIndex: z.number().int().min(0),
      explanation: z.string(),
    })
  ).optional(),

  // 可选扩展字段（逐步引入）
  estimatedMinutes: z.number().int().positive().optional(),
  prerequisites: z.array(z.string()).optional(),
  outcomes: z.array(z.string()).optional(),
  stage: z.enum(['foundation', 'practice', 'project', 'interview', 'advanced']).optional(),
});

// Docs 集合
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: testdevMetadataSchema,
    }),
  }),
};