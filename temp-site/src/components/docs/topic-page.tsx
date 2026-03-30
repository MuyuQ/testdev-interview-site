import Link from "next/link";
import { getAllTopics } from "@/content";
import { DocsFrame } from "./docs-frame";
import { RichText } from "./rich-text";
import { FavoriteToggle } from "@/components/client/favorite-toggle";
import { ProgressToggle } from "@/components/client/progress-toggle";
import { RecentTracker } from "@/components/client/recent-tracker";
import type {
  AILearningGuide,
  ContentTopic,
  GlossaryLookup,
  GlossaryTerm,
  PracticeTemplate,
  RichTextToken,
  StandardTopic,
  TopicSection,
} from "@/content/types";
import { categoryConfig } from "@/lib/site-config";

type TopicPageProps = {
  topic: ContentTopic;
  glossaryLookup: GlossaryLookup;
};

type RenderSection =
  | { id: string; title: string; kind: "paragraph"; content: RichTextToken[]; description?: string }
  | { id: string; title: string; kind: "list"; items: string[]; description?: string }
  | {
      id: string;
      title: string;
      kind: "qa-list";
      items: Array<{ question: string; answer: string }>;
      description?: string;
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
          <section key={section.id} id={section.id} className="content-block">
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
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {section.kind === "qa-list" ? (
                <div className="qa-list">
                  {section.items.map((item) => (
                    <article key={item.question}>
                      <strong>{item.question}</strong>
                      <p>{item.answer}</p>
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
              <div className="topic-list-tags">
                {relatedTopics.map((item) => (
                  <Link key={`${item.category}-${item.slug}`} href={`/${item.category}/${item.slug}`}>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>
    </DocsFrame>
  );
}

function getSections(topic: ContentTopic): RenderSection[] {
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

function getStandardSections(topic: StandardTopic): RenderSection[] {
  return topic.sections.map((section) => normalizeSection(section));
}

function getGlossarySections(topic: GlossaryTerm): RenderSection[] {
  return [
    { id: "definition", title: "定义", kind: "paragraph", content: text(topic.definition) },
    {
      id: "why-it-matters",
      title: "为什么重要",
      kind: "paragraph",
      content: text(topic.whyItMatters),
    },
    { id: "common-mistakes", title: "易错点", kind: "list", items: topic.commonMistakes },
    {
      id: "confusing-terms",
      title: "易混淆术语",
      kind: "qa-list",
      items: topic.confusingTerms.map((item) => ({
        question: item.term,
        answer: item.difference,
      })),
    },
    {
      id: "frequent-questions",
      title: "高频问题",
      kind: "list",
      items: topic.frequentQuestions,
    },
    { id: "answer-hints", title: "回答提示", kind: "list", items: topic.answerHints },
  ];
}

function getAILearningSections(topic: AILearningGuide): RenderSection[] {
  return [
    { id: "learning-goal", title: "学习目标", kind: "paragraph", content: text(topic.learningGoal) },
    { id: "why-now", title: "为什么现在学", kind: "paragraph", content: text(topic.whyNow) },
    { id: "learning-steps", title: "推荐学习路径", kind: "list", items: topic.learningSteps },
    {
      id: "practical-use-cases",
      title: "真实项目落地",
      kind: "list",
      items: topic.practicalUseCases,
    },
    { id: "common-mistakes", title: "常见误区", kind: "list", items: topic.commonMistakes },
    {
      id: "interview-talking-points",
      title: "面试表达",
      kind: "list",
      items: topic.interviewTalkingPoints,
    },
  ];
}

function getTemplateSections(topic: PracticeTemplate): RenderSection[] {
  return [
    { id: "target-scenario", title: "适用场景", kind: "paragraph", content: text(topic.targetScenario) },
    { id: "includes", title: "模板包含", kind: "list", items: topic.includes },
    { id: "how-to-use", title: "怎么使用", kind: "list", items: topic.howToUse },
    { id: "extension-ideas", title: "延伸练手方向", kind: "list", items: topic.extensionIdeas },
  ];
}

function normalizeSection(section: TopicSection): RenderSection {
  if (section.kind === "paragraph") {
    return section;
  }

  return section;
}

function text(content: string): RichTextToken[] {
  return [{ type: "text", content }];
}
