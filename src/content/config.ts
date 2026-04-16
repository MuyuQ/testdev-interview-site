import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";

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
});

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: testdevMetadataSchema,
    }),
  }),
};
