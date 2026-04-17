import { mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { generateFrontmatter, generateBody } from "./lib/markdown-generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = resolve(__dirname, "../src/content/docs");

async function main() {
  console.log("Loading data from temp-site...");

  const tempSiteContent = resolve(__dirname, "../temp-site/src/content");
  const tempSiteUrl = pathToFileURL(tempSiteContent).href;

  // Dynamically import the TypeScript data files using file:// URLs
  const dataModule = await import(`${tempSiteUrl}/data.ts`);
  const selftestModule = await import(`${tempSiteUrl}/selftest-data.ts`);

  const {
    glossaryTopics,
    techTopics,
    projectTopics,
    scenarioTopics,
    codingTopics,
    roadmapTopics,
    aiLearningTopics,
    practiceTemplateTopics,
  } = dataModule;

  const { selfTestData } = selftestModule;

  const allTopics = [
    ...glossaryTopics,
    ...techTopics,
    ...projectTopics,
    ...scenarioTopics,
    ...codingTopics,
    ...roadmapTopics,
    ...aiLearningTopics,
    ...practiceTemplateTopics,
  ];

  // Build self-test lookup by topicSlug
  const selfTestsByTopic: Record<string, unknown[]> = {};
  for (const group of selfTestData) {
    selfTestsByTopic[group.topicSlug] = group.questions;
  }

  console.log(`Found ${allTopics.length} topics. Generating markdown files...`);

  let generated = 0;
  const errors: string[] = [];

  for (const topic of allTopics) {
    try {
      const categoryDir = join(OUTPUT_DIR, topic.category);
      if (!existsSync(categoryDir)) {
        mkdirSync(categoryDir, { recursive: true });
      }

      const selfTests = selfTestsByTopic[topic.slug] || [];

      const frontmatter = generateFrontmatter(topic, selfTests);
      const body = generateBody(topic);
      const content = frontmatter + "\n\n" + body;

      const outputPath = join(categoryDir, `${topic.slug}.md`);
      writeFileSync(outputPath, content, "utf-8");
      generated++;
      console.log(`  ✓ ${topic.category}/${topic.slug}.md`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${topic.category}/${topic.slug}: ${message}`);
      console.error(`  ✗ ${topic.category}/${topic.slug}: ${message}`);
    }
  }

  console.log(`\nDone! Generated ${generated} files.`);
  if (errors.length > 0) {
    console.error(`\n${errors.length} errors:`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
