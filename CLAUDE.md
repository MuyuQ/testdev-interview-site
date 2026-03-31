# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chinese content site for test development interview preparation (测试开发面试速成站). Built with Next.js 16, React 19, Tailwind CSS 4, and TypeScript. The site organizes content across 8 categories: glossary, tech, project, scenario, coding, roadmap, ai-learning, and practice-template.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Next.js 16 Notes

This project uses Next.js 16 with breaking changes. Consult `node_modules/next/dist/docs/` before writing Next.js-specific APIs. Heed deprecation notices in the codebase.

## Architecture

### Route Groups
- `(home)` - Homepage at `/`
- `(docs)` - Category pages at `/[category]` and topic pages at `/[category]/[slug]`

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json)

### Component Split
- `src/components/client/` - Client components (use `"use client"` directive, hooks, interactive UI)
- `src/components/docs/` - Server components (render content, static UI)

### Content Layer
- `src/content/types.ts` - TypeScript types for all content (TopicMeta, GlossaryTerm, StandardTopic, etc.)
- `src/content/data.ts` - Static content data and helper functions (getAllTopics, getHomeQuestionGuides, etc.)
- `src/content/index.ts` - Re-exports all content

### Hooks Pattern
Hooks in `src/hooks/` use localStorage via `src/lib/client/storage.ts` for persistence (progress, favorites, recent views).

### Client Storage
Storage keys follow pattern `testdev:{feature}` (e.g., `testdev:progress`, `testdev:theme`).

### Category Config
All category metadata centralized in `src/lib/site-config.ts` with `orderedCategories` array and `categoryConfig` record.

## Content Types

The content system supports multiple topic types:
- `GlossaryTerm` - Term definitions with examples, mistakes, confusing terms
- `StandardTopic` - General topics with paragraph/list/qa-list sections
- `AILearningGuide` - AI-focused learning content
- `PracticeTemplate` - Templates for practice and interview expression

## Language

- Site content: Chinese (zh-CN)
- Code comments: Chinese (per user preference)
- Git commit messages: English