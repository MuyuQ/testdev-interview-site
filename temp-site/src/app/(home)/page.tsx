import Link from "next/link";
import { StudyDashboard } from "@/components/client/study-dashboard";
import { getAllTopics, getPopularTopics, getRoadmapHighlights } from "@/content";
import { categoryConfig, orderedCategories } from "@/lib/site-config";

export default function HomePage() {
  const allTopics = getAllTopics();
  const popularTopics = getPopularTopics();
  const roadmapHighlights = getRoadmapHighlights();

  return (
    <main className="home-page">
      <section className="hero-band">
        <div className="hero-copy">
          <p className="eyebrow">测试开发面试速成站</p>
          <h1>从高频问题入手，快速搭起可复述的知识骨架。</h1>
          <p className="hero-summary">
            这个站点按“术语体系、技术专题、项目类型、场景题、编码题、学习路线、AI
            成长和练手模板”组织内容，目的是让你在短时间内能讲清概念、讲透项目、说出方案。
          </p>
          <div className="hero-actions">
            <Link href="/roadmap/3-day-interview-map" className="button-primary">
              打开 3 天速记路线
            </Link>
            <Link href="/glossary" className="button-secondary">
              先看高频术语
            </Link>
          </div>
        </div>

        <div className="hero-map">
          <div className="map-panel">
            <span>首版内容规模</span>
            <strong>{allTopics.length}</strong>
            <p>个主题节点，覆盖项目表达、技术问答、场景题和模板化练手路径。</p>
          </div>
          <div className="map-grid">
            {orderedCategories.map((category) => (
              <Link key={category} href={categoryConfig[category].href} className="map-card">
                <strong>{categoryConfig[category].homeLabel}</strong>
                <span>{categoryConfig[category].description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <p className="eyebrow">速成路线</p>
          <h2>先按天数推进，再补模块短板。</h2>
          <p>首版路线分成 3 天速记版和 7 天面试版，优先保证你能说清高频知识点。</p>
        </div>
        <div className="split-list">
          {roadmapHighlights.map((item) => (
            <Link key={item.slug} href={`/${item.category}/${item.slug}`} className="split-item">
              <div>
                <strong>{item.title}</strong>
                <p>{item.summary}</p>
              </div>
              <span>{item.difficulty === "beginner" ? "速记版" : "面试版"}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <p className="eyebrow">高频问题总览</p>
          <h2>这些节点最容易进入追问。</h2>
          <p>建议先看权重 3 的内容，再回头补细节和关联知识。</p>
        </div>
        <div className="question-list">
          {popularTopics.map((item) => (
            <Link key={item.slug} href={`/${item.category}/${item.slug}`} className="question-item">
              <strong>{item.title}</strong>
              <p>{item.summary}</p>
              <span>{item.tags.slice(0, 3).join(" / ")}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <p className="eyebrow">模块入口</p>
          <h2>按照角色最常见的问法来组织学习顺序。</h2>
          <p>每个模块都可以直接进入条目详情页，同时也支持搜索和最近浏览记录。</p>
        </div>
        <div className="module-stack">
          {orderedCategories.map((category) => {
            const items = allTopics.filter((topic) => topic.category === category).slice(0, 3);
            return (
              <section key={category} className="module-row">
                <div className="module-meta">
                  <p className="module-kicker">{categoryConfig[category].navLabel}</p>
                  <h3>{categoryConfig[category].title}</h3>
                  <p>{categoryConfig[category].description}</p>
                  <Link href={categoryConfig[category].href}>进入模块</Link>
                </div>
                <div className="module-links">
                  {items.map((item) => (
                    <Link key={item.slug} href={`/${item.category}/${item.slug}`} className="module-link">
                      <strong>{item.title}</strong>
                      <span>{item.summary}</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <StudyDashboard />
    </main>
  );
}
