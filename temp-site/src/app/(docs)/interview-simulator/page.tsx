import { DocsFrame } from "@/components/docs/docs-frame";
import { InterviewSimulator } from "@/components/client/interview-simulator";

export default function InterviewSimulatorPage() {
  const toc = [
    { id: "simulator-intro", label: "模拟面试" },
    { id: "simulator-session", label: "答题区域" },
  ];

  return (
    <DocsFrame category="scenario" toc={toc}>
      <article className="docs-article" id="page-top">
        <section className="topic-hero">
          <p className="eyebrow">面试冲刺</p>
          <h1>模拟面试器</h1>
          <p className="topic-summary">
            选择预设追问链，体验连续追问场景，模拟真实面试的压力和节奏。
          </p>
          <div className="topic-meta-row">
            <span>预设追问链</span>
            <span>连续追问</span>
            <span>自评复盘</span>
          </div>
        </section>

        <section className="content-block" id="simulator-session">
          <div className="content-block-body">
            <InterviewSimulator />
          </div>
        </section>
      </article>
    </DocsFrame>
  );
}
