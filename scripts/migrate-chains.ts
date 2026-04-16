import { mkdirSync, writeFileSync } from "fs";
import { resolve, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const tempSiteUrl = pathToFileURL(
    resolve(__dirname, "../temp-site/src/content"),
  ).href;
  const { getAllInterviewChains } = await import(
    `${tempSiteUrl}/interview-chains.ts`
  );

  const chains = getAllInterviewChains();
  const outputDir = resolve(__dirname, "../src/content/docs/interview-chains");

  console.log(
    `Found ${chains.length} interview chains. Generating markdown files...`,
  );

  for (const chain of chains) {
    const lines: string[] = ["---"];
    lines.push(`title: "${escapeYaml(chain.title)}"`);
    lines.push(`description: "${escapeYaml(chain.description)}"`);
    lines.push(`category: "interview-chains"`);
    lines.push(`difficulty: "interview"`);
    lines.push(`interviewWeight: 3`);
    lines.push(`tags: ["面试追问", "深度追问", "${chain.category}"]`);
    lines.push(`chainCategory: "${chain.category}"`);
    lines.push("---");
    lines.push("");
    lines.push(`## ${chain.title}`);
    lines.push("");
    lines.push(chain.description);
    lines.push("");

    for (let i = 0; i < chain.steps.length; i++) {
      const step = chain.steps[i];
      const level = i === 0 ? "##" : i === 1 ? "###" : "####";
      const depthLabel =
        i === 0
          ? "第一问"
          : i === 1
            ? "第二问（追问）"
            : i === 2
              ? "第三问（深度追问）"
              : `第${i + 1}问（终极追问）`;

      lines.push(`${level} ${depthLabel}`);
      lines.push("");
      lines.push(`**${step.question}**`);
      lines.push("");
      if (step.followUpHint) {
        lines.push(`> 💡 提示：${step.followUpHint}`);
        lines.push("");
      }
    }

    const outputPath = join(outputDir, `${chain.id}.md`);
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(outputPath, lines.join("\n"), "utf-8");
    console.log(
      `  ✓ interview-chains/${chain.id}.md (${chain.steps.length} steps)`,
    );
  }

  console.log(`\nDone! Generated ${chains.length} chain files.`);
}

function escapeYaml(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

main().catch(console.error);
