import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { docsSchema } from "@astrojs/starlight/schema";

const selfTestSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
  explanation: z.string(),
});

const testdevMetadataSchema = z.object({
  difficulty: z.enum(["beginner", "interview"]).optional(),
  interviewWeight: z.number().min(1).max(3).optional(),
  category: z.enum([
    "glossary",
    "tech",
    "project",
    "scenario",
    "coding",
    "roadmap",
    "ai-learning",
    "practice-template",
    "interview-chains",
  ]),
  tags: z.array(z.string()).default([]),
  relatedSlugs: z.array(z.string()).default([]),
  selfTests: z.array(selfTestSchema).optional(),
});

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/docs" }),
    schema: docsSchema({
      extend: testdevMetadataSchema,
    }),
  }),
};
