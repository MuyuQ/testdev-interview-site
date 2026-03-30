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

export type RichTextToken =
  | { type: "text"; content: string }
  | { type: "term"; slug: string; label: string };

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
      items: string[];
    }
  | {
      id: string;
      title: string;
      description?: string;
      kind: "qa-list";
      items: Array<{ question: string; answer: string }>;
    };

export type StandardTopic = TopicMeta & {
  sections: TopicSection[];
};

export type GlossaryTerm = TopicMeta & {
  term: string;
  shortDefinition: string;
  definition: string;
  whyItMatters: string;
  commonMistakes: string[];
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
};

export type PracticeTemplate = TopicMeta & {
  templateType: "engineering" | "interview";
  targetScenario: string;
  includes: string[];
  howToUse: string[];
  extensionIdeas: string[];
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

export type GlossaryLookup = Record<
  string,
  {
    term: string;
    shortDefinition: string;
  }
>;

