export type TopicCategory =
  | "glossary"
  | "tech"
  | "project"
  | "scenario"
  | "coding"
  | "roadmap"
  | "ai-learning"
  | "practice-template";

export type TopicMeta = {
  slug: string;
  title: string;
  summary: string;
  category: TopicCategory;
  tags: string[];
  difficulty: "beginner" | "interview";
  interviewWeight: 1 | 2 | 3;
  relatedSlugs?: string[];
};

export type MixedTerm = {
  slug: string;
  term: string;
  difference: string;
};

// 常见考点项，包含标题和详细解释
export type CommonMistakeItem = {
  title: string;
  detail: string;
};

export type RichTextToken =
  | { type: "text"; content: string }
  | { type: "term"; slug: string; label: string };

export type InlineRichText = string | RichTextToken[];

export type TopicSection =
  | {
      id: string;
      title: string;
      description?: string;
      kind: "paragraph";
      content: RichTextToken[];
    }
  | {
      id: string;
      title: string;
      description?: string;
      kind: "list";
      items: InlineRichText[];
    }
  | {
      id: string;
      title: string;
      description?: string;
      kind: "qa-list";
      items: Array<{ question: string; answer: InlineRichText }>;
    };

export type StandardTopic = TopicMeta & {
  sections: TopicSection[];
};

export type GlossaryTerm = TopicMeta & {
  term: string;
  shortDefinition: string;
  definition: string;
  popoverExample?: string;
  whyItMatters: string;
  projectExample?: string;
  examples?: string[];
  commonMistakes: CommonMistakeItem[];
  confusingTerms: MixedTerm[];
  frequentQuestions: string[];
  answerHints: string[];
  aliases?: string[];
  usedInSlugs?: string[];
};

export type AILearningGuide = TopicMeta & {
  learningGoal: string;
  whyNow: string;
  learningSteps: string[];
  practicalUseCases: string[];
  commonMistakes: string[];
  interviewTalkingPoints: string[];
  sections?: TopicSection[];
};

export type PracticeTemplate = TopicMeta & {
  templateType: "engineering" | "interview";
  targetScenario: string;
  includes: string[];
  howToUse: string[];
  extensionIdeas: string[];
  sections?: TopicSection[];
};

export type ContentTopic =
  | GlossaryTerm
  | StandardTopic
  | AILearningGuide
  | PracticeTemplate;

export type SearchRecord = Pick<
  TopicMeta,
  "slug" | "title" | "summary" | "category" | "tags" | "difficulty" | "interviewWeight"
>;

export type HomeQuestionGuide = {
  slug: string;
  ask: string;
  answerLead: string;
};

export type GlossaryLookup = Record<
  string,
  {
    term: string;
    shortDefinition: string;
    definition?: string;
    popoverExample?: string;
  }
>;
