import Link from "next/link";
import { getAllTopics } from "@/content";
import { DocsFrame } from "./docs-frame";
import { RichText } from "./rich-text";
import { FavoriteToggle } from "@/components/client/favorite-toggle";
import { ProgressToggle } from "@/components/client/progress-toggle";
import { RecentTracker } from "@/components/client/recent-tracker";
import { CollapsibleAnswer } from "@/components/client/collapsible-answer";
import type {
  AILearningGuide,
  ContentTopic,
  GlossaryLookup,
  GlossaryTerm,
  InlineRichText,
  PracticeTemplate,
  RichTextToken,
  StandardTopic,
  TopicSection,
} from "@/content/types";
import { categoryConfig } from "@/lib/site-config";
import { RelatedTopicsGraph } from "./related-topics-graph";

type TopicPageProps = {
  topic: ContentTopic;
  glossaryLookup: GlossaryLookup;
};

export function TopicPage({ topic, glossaryLookup }: TopicPageProps) {
  const config = categoryConfig[topic.category];
  const sections = getSections(topic);
  const relatedTopics = (topic.relatedSlugs ?? [])
    .map((slug) => getAllTopics().find((item) => item.slug === slug))
    .filter((item): item is ContentTopic => Boolean(item));

  return (
    <DocsFrame
      category={topic.category}
      toc={sections.map((section) => ({ id: section.id, label: section.title }))}
    >
      <RecentTracker
        item={{
          slug: topic.slug,
          title: topic.title,
          summary: topic.summary,
          category: topic.category,
        }}
      />
      <article className="docs-article" id="page-top">
        <section className="topic-hero">
          <div className="topic-hero-copy">
            <p className="eyebrow">{config.navLabel}</p>
            <h1>{topic.title}</h1>
            <p className="topic-summary">{topic.summary}</p>
            <div className="topic-meta-row">
              <span>{topic.difficulty === "beginner" ? "入门" : "面试"}</span>
              <span>面试权重 {topic.interviewWeight}</span>
              <span>{topic.tags.join(" / ")}</span>
            </div>
          </div>
          <div className="topic-hero-tools">
            <ProgressToggle topicId={`${topic.category}:${topic.slug}`} />
            <FavoriteToggle
              item={{
                slug: topic.slug,
                title: topic.title,
                category: topic.category,
                summary: topic.summary,
              }}
            />
          </div>
        </section>

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="content-block"
            data-kind={section.kind}
            data-section={section.id}
          >
            <div className="content-block-head">
              <h2>{section.title}</h2>
              {section.description ? <p>{section.description}</p> : null}
            </div>
            <div className="content-block-body">
              {section.kind === "paragraph" ? (
                <p className="rich-paragraph">
                  <RichText tokens={section.content} glossaryLookup={glossaryLookup} />
                </p>
              ) : null}

              {section.kind === "list" ? (
                <ul className="bullet-list">
                  {section.items.map((item, index) => (
                    <li key={`${section.id}-${index}`}>
                      <InlineRichTextView item={item} glossaryLookup={glossaryLookup} />
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.kind === "qa-list" ? (
                <div className="qa-list">
                  {section.items.map((item, index) => (
                    <article key={item.question}>
                      <span className="qa-index">{String(index + 1).padStart(2, "0")}</span>
                      <strong className="qa-question">{item.question}</strong>
                      {/* 高频追问使用折叠答案组件 */}
                      {section.id === "frequent-questions" ? (
                        <CollapsibleAnswer answer={typeof item.answer === "string" ? item.answer : ""} />
                      ) : (
                        <p className="qa-answer">
                          <InlineRichTextView item={item.answer} glossaryLookup={glossaryLookup} />
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ))}

        {relatedTopics.length ? (
          <section className="content-block">
            <div className="content-block-head">
              <h2>相关主题</h2>
              <p>继续顺着知识链阅读，避免只记住孤立概念。</p>
            </div>
            <div className="content-block-body">
              <RelatedTopicsGraph
                currentSlug={topic.slug}
                relatedTopics={relatedTopics}
              />
            </div>
          </section>
        ) : null}
      </article>
    </DocsFrame>
  );
}

function getSections(topic: ContentTopic): TopicSection[] {
  if ("term" in topic) {
    return getGlossarySections(topic);
  }

  if ("learningGoal" in topic) {
    return getAILearningSections(topic);
  }

  if ("templateType" in topic) {
    return getTemplateSections(topic);
  }

  return getStandardSections(topic);
}

function getStandardSections(topic: StandardTopic): TopicSection[] {
  return topic.sections.map((section) => normalizeSection(section));
}

function getGlossarySections(topic: GlossaryTerm): TopicSection[] {
  return [
    {
      id: "definition",
      title: "定义",
      kind: "paragraph",
      content: text(topic.definition),
    },
    {
      id: "why-it-matters",
      title: "为什么重要",
      kind: "paragraph",
      content: text(topic.whyItMatters),
    },
    {
      id: "common-mistakes",
      title: "常见考点",
      kind: "qa-list",
      items: topic.commonMistakes.map((item) => ({
        question: item.title,
        answer: item.detail,
      })),
    },
    {
      id: "frequent-questions",
      title: "高频追问",
      kind: "qa-list",
      items: topic.frequentQuestions.map((question, index) => ({
        question,
        answer: topic.answerHints[index] ?? "",
      })),
    },
  ];
}

function getAILearningSections(topic: AILearningGuide): TopicSection[] {
  const baseSections: TopicSection[] = [
    {
      id: "learning-goal",
      title: "先记住目标",
      description: "先明确为什么学这件事，避免只堆工具名。",
      kind: "paragraph",
      content: text(topic.learningGoal),
    },
    {
      id: "why-now",
      title: "为什么现在学",
      description: "把趋势判断和岗位价值放到一起看。",
      kind: "paragraph",
      content: text(topic.whyNow),
    },
    {
      id: "learning-steps",
      title: "推荐学习路径",
      description: "按上手顺序推进，而不是平铺式扫概念。",
      kind: "list",
      items: topic.learningSteps,
    },
    {
      id: "practical-use-cases",
      title: "真实项目落地",
      description: "重点看它到底能帮你解决哪些具体问题。",
      kind: "list",
      items: topic.practicalUseCases,
    },
    {
      id: "common-mistakes",
      title: "常见误区",
      description: "这些误判最容易让内容显得空泛或不落地。",
      kind: "list",
      items: topic.commonMistakes,
    },
    {
      id: "interview-talking-points",
      title: "面试表达",
      description: "把学习内容翻译成可复述、可追问的说法。",
      kind: "list",
      items: topic.interviewTalkingPoints,
    },
  ];

  return [...baseSections, ...(topic.sections ?? []).map((section) => normalizeSection(section))];
}

function getTemplateSections(topic: PracticeTemplate): TopicSection[] {
  const baseSections: TopicSection[] = [
    {
      id: "target-scenario",
      title: "适用目标",
      description: "先确认这个模板适合拿来练什么，不要一上来就堆功能。",
      kind: "paragraph",
      content: text(topic.targetScenario),
    },
    {
      id: "includes",
      title: "模板包含",
      description: "先看最小骨架，知道完成后应该具备哪些能力。",
      kind: "list",
      items: topic.includes,
    },
    {
      id: "how-to-use",
      title: "怎么使用",
      description: "按最小可交付版本推进，避免练手项目半途变形。",
      kind: "list",
      items: topic.howToUse,
    },
    {
      id: "extension-ideas",
      title: "延伸练手方向",
      description: "练完基础后，再补能转成项目故事的部分。",
      kind: "list",
      items: topic.extensionIdeas,
    },
  ];

  return [...baseSections, ...(topic.sections ?? []).map((section) => normalizeSection(section))];
}

function normalizeSection(section: TopicSection): TopicSection {
  if (section.kind === "paragraph") {
    return section;
  }

  if (section.kind === "list") {
    return {
      ...section,
      items: section.items,
    };
  }

  return {
    ...section,
    items: section.items,
  };
}

function text(content: string): RichTextToken[] {
  return [{ type: "text", content }];
}

function InlineRichTextView({
  item,
  glossaryLookup,
}: {
  item: InlineRichText;
  glossaryLookup: GlossaryLookup;
}) {
  if (typeof item === "string") {
    return item;
  }

  return <RichText tokens={item} glossaryLookup={glossaryLookup} />;
}
