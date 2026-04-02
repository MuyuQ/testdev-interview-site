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
  commonMistakes: CommonMistakeItem[];
  confusingTerms: MixedTerm[];
  frequentQuestions: string[];
  answerHints: string[];
  aliases?: string[];
  usedInSlugs?: string[];
  sections?: TopicSection[];
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

// 搜索匹配来源类型
export type SearchMatchSource = "title" | "summary" | "definition" | "qa" | "tags";

// 增强搜索结果类型
export type EnhancedSearchResult = SearchRecord & {
  matchSource: SearchMatchSource;
  matchSnippet: string; // 匹配片段预览（截取50字符左右）
};

// 扩展搜索记录，包含更多可搜索字段
export type ExtendedSearchRecord = SearchRecord & {
  definition?: string; // GlossaryTerm 的定义
  shortDefinition?: string; // GlossaryTerm 的简短定义
  frequentQuestions?: string[]; // GlossaryTerm 的高频问题
  sections?: TopicSection[]; // 各类型的 sections
};

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

// 自测题类型
export type SelfTestQuestion = {
  id: string;
  topicSlug: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type TopicSelfTests = {
  topicSlug: string;
  questions: SelfTestQuestion[];
};

// 自测记录类型
export type SelfTestRecord = {
  topicSlug: string;
  score: number;
  total: number;
  completedAt: string;
};

// 追问链类型
export type InterviewChainStep = {
  slug: string;
  question: string;
  followUpHint?: string;
};

export type InterviewChain = {
  id: string;
  title: string;
  description: string;
  category: TopicCategory;
  steps: InterviewChainStep[];
};
