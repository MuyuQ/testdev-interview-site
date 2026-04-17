import type {
  ContentTopic,
  GlossaryTerm,
  AILearningGuide,
  PracticeTemplate,
  TopicSection,
  RichTextToken,
  SelfTestQuestion,
} from "../../temp-site/src/content/types.js";

export function generateFrontmatter(
  topic: ContentTopic,
  selfTests?: SelfTestQuestion[],
): string {
  const lines: string[] = ["---"];
  lines.push(`title: "${escapeYaml(topic.title)}"`);
  lines.push(`description: "${escapeYaml(topic.summary)}"`);
  lines.push(`category: "${topic.category}"`);
  lines.push(`difficulty: "${topic.difficulty}"`);
  lines.push(`interviewWeight: ${topic.interviewWeight}`);
  lines.push(
    `tags: [${topic.tags.map((t) => `"${escapeYaml(t)}"`).join(", ")}]`,
  );

  // GlossaryTerm specific fields
  if (isGlossaryTerm(topic)) {
    lines.push(`term: "${escapeYaml(topic.term)}"`);
    lines.push(`shortDefinition: "${escapeYaml(topic.shortDefinition)}"`);
    lines.push(`definition: "${escapeYaml(topic.definition)}"`);
    if (topic.popoverExample) {
      lines.push(`popoverExample: "${escapeYaml(topic.popoverExample)}"`);
    }
    if (topic.whyItMatters) {
      lines.push(`whyItMatters: "${escapeYaml(topic.whyItMatters)}"`);
    }
    if (topic.commonMistakes?.length) {
      lines.push(`commonMistakes:`);
      for (const m of topic.commonMistakes) {
        lines.push(`  - title: "${escapeYaml(m.title)}"`);
        lines.push(`    detail: "${escapeYaml(m.detail)}"`);
      }
    }
    if (topic.confusingTerms?.length) {
      lines.push(`confusingTerms:`);
      for (const t of topic.confusingTerms) {
        lines.push(`  - slug: "${t.slug}"`);
        lines.push(`    term: "${escapeYaml(t.term)}"`);
        lines.push(`    difference: "${escapeYaml(t.difference)}"`);
      }
    }
    if (topic.frequentQuestions?.length) {
      lines.push(`frequentQuestions:`);
      for (const q of topic.frequentQuestions) {
        lines.push(`  - "${escapeYaml(q)}"`);
      }
    }
    if (topic.answerHints?.length) {
      lines.push(`answerHints:`);
      for (const h of topic.answerHints) {
        lines.push(`  - "${escapeYaml(h)}"`);
      }
    }
    if (topic.relatedSlugs?.length) {
      lines.push(
        `relatedSlugs: [${topic.relatedSlugs.map((s) => `"${s}"`).join(", ")}]`,
      );
    }
    if (topic.aliases?.length) {
      lines.push(
        `aliases: [${topic.aliases.map((a) => `"${escapeYaml(a)}"`).join(", ")}]`,
      );
    }
  }

  // AILearningGuide specific fields
  if (isAILearningGuide(topic)) {
    lines.push(`learningGoal: "${escapeYaml(topic.learningGoal)}"`);
    lines.push(`whyNow: "${escapeYaml(topic.whyNow)}"`);
    if (topic.learningSteps?.length) {
      lines.push(`learningSteps:`);
      for (const s of topic.learningSteps) {
        lines.push(`  - "${escapeYaml(s)}"`);
      }
    }
    if (topic.practicalUseCases?.length) {
      lines.push(`practicalUseCases:`);
      for (const u of topic.practicalUseCases) {
        lines.push(`  - "${escapeYaml(u)}"`);
      }
    }
    if (topic.commonMistakes?.length) {
      lines.push(`commonMistakes:`);
      for (const m of topic.commonMistakes) {
        lines.push(`  - "${escapeYaml(m)}"`);
      }
    }
    if (topic.interviewTalkingPoints?.length) {
      lines.push(`interviewTalkingPoints:`);
      for (const p of topic.interviewTalkingPoints) {
        lines.push(`  - "${escapeYaml(p)}"`);
      }
    }
  }

  // PracticeTemplate specific fields
  if (isPracticeTemplate(topic)) {
    lines.push(`templateType: "${topic.templateType}"`);
    lines.push(`targetScenario: "${escapeYaml(topic.targetScenario)}"`);
    if (topic.includes?.length) {
      lines.push(`includes:`);
      for (const i of topic.includes) {
        lines.push(`  - "${escapeYaml(i)}"`);
      }
    }
    if (topic.howToUse?.length) {
      lines.push(`howToUse:`);
      for (const h of topic.howToUse) {
        lines.push(`  - "${escapeYaml(h)}"`);
      }
    }
    if (topic.extensionIdeas?.length) {
      lines.push(`extensionIdeas:`);
      for (const e of topic.extensionIdeas) {
        lines.push(`  - "${escapeYaml(e)}"`);
      }
    }
  }

  // Self-tests embedded in frontmatter
  if (selfTests?.length) {
    lines.push(`selfTests:`);
    for (const q of selfTests) {
      lines.push(`  - id: "${q.id}"`);
      lines.push(`    question: "${escapeYaml(q.question)}"`);
      lines.push(`    options:`);
      for (const o of q.options) {
        lines.push(`      - "${escapeYaml(o)}"`);
      }
      lines.push(`    correctIndex: ${q.correctIndex}`);
      lines.push(`    explanation: "${escapeYaml(q.explanation)}"`);
    }
  }

  lines.push("---");
  return lines.join("\n");
}

export function generateBody(topic: ContentTopic): string {
  const sections = ("sections" in topic ? topic.sections : []) as TopicSection[];
  if (sections.length === 0) return "";

  const parts: string[] = [];
  for (const section of sections) {
    parts.push(generateSection(section, topic.category));
  }
  return parts.join("\n\n");
}

function generateSection(section: TopicSection, category: string): string {
  let md = `## ${section.title}\n\n`;

  if (section.description) {
    md += `${section.description}\n\n`;
  }

  switch (section.kind) {
    case "paragraph":
      md += renderRichText(section.content, category);
      break;
    case "list":
      md += section.items
        .map((item) => `- ${renderInlineRichText(item, category)}`)
        .join("\n");
      break;
    case "qa-list":
      md += section.items
        .map(
          (item) =>
            `### ${item.question}\n\n${renderInlineRichText(item.answer, category)}`,
        )
        .join("\n\n");
      break;
  }

  return md;
}

function renderRichText(tokens: RichTextToken[], _category: string): string {
  return tokens
    .map((token) => {
      if (token.type === "text") {
        return token.content;
      } else if (token.type === "term") {
        // Term links point to glossary
        return `[${token.label}](/glossary/${token.slug}/)`;
      }
      return "";
    })
    .join("");
}

function renderInlineRichText(
  item: string | RichTextToken[],
  category: string,
): string {
  if (typeof item === "string") return item;
  return renderRichText(item, category);
}

function escapeYaml(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

function isGlossaryTerm(topic: ContentTopic): topic is GlossaryTerm {
  return "term" in topic && "shortDefinition" in topic;
}

function isAILearningGuide(topic: ContentTopic): topic is AILearningGuide {
  return "learningGoal" in topic;
}

function isPracticeTemplate(topic: ContentTopic): topic is PracticeTemplate {
  return "templateType" in topic;
}
