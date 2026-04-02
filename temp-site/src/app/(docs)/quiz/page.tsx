import { DocsFrame } from "@/components/docs/docs-frame";
import { RandomQuiz } from "@/components/client/random-quiz";

export default function QuizPage() {
  const toc = [
    { id: "quiz-config", label: "抽题配置" },
    { id: "quiz-session", label: "答题区域" },
  ];

  return (
    <DocsFrame category="scenario" toc={toc}>
      <article className="docs-article" id="page-top">
        <section className="topic-hero">
          <p className="eyebrow">面试冲刺</p>
          <h1>随机抽题</h1>
          <p className="topic-summary">
            从全站内容中随机抽取问题，模拟真实面试场景，检验你的临场反应能力。
          </p>
          <div className="topic-meta-row">
            <span>支持范围筛选</span>
            <span>支持难度筛选</span>
            <span>自评记录</span>
          </div>
        </section>

        <section className="content-block" id="quiz-session">
          <div className="content-block-body">
            <RandomQuiz />
          </div>
        </section>
      </article>
    </DocsFrame>
  );
}
