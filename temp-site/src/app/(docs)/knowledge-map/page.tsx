import { DocsFrame } from "@/components/docs/docs-frame";
import { KnowledgeMap } from "@/components/client/knowledge-map";

export default function KnowledgeMapPage() {
  const toc = [
    { id: "map-view", label: "知识图谱" },
    { id: "category-filter", label: "分类筛选" },
    { id: "legend", label: "图例说明" },
  ];

  return (
    <DocsFrame category="roadmap" toc={toc}>
      <article className="docs-article" id="page-top">
        <section className="topic-hero">
          <p className="eyebrow">学习路线</p>
          <h1>知识图谱</h1>
          <p className="topic-summary">
            可视化浏览全站知识点及其关联关系，按分类分组展示，支持搜索和筛选。
          </p>
          <div className="topic-meta-row">
            <span>8 个分类</span>
            <span>颜色区分</span>
            <span>关联关系</span>
          </div>
        </section>

        <section className="content-block" id="map-view">
          <div className="content-block-head">
            <h2>知识图谱视图</h2>
            <p>每个节点代表一个知识点，点击可进入详情页。连线表示两个知识点之间存在关联。</p>
          </div>
          <div className="content-block-body">
            <KnowledgeMap />
          </div>
        </section>
      </article>
    </DocsFrame>
  );
}
