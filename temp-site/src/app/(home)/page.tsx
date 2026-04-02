import Link from "next/link";
import { StudyDashboard } from "@/components/client/study-dashboard";
import { OnboardingBanner } from "@/components/client/onboarding-banner";
import { getAllTopics, getHomeQuestionGuides, getRoadmapHighlights } from "@/content";
import { categoryConfig, orderedCategories, getRecommendedEntry } from "@/lib/site-config";

export default function HomePage() {
  const allTopics = getAllTopics();
  const roadmapHighlights = getRoadmapHighlights();
  const hotQuestionSlugs = [
    "api-testing",
    "payment-callback",
    "pytest",
    "playwright",
    "idempotency",
    "ci-cd",
  ];
  const hotQuestions = hotQuestionSlugs
    .map((slug) => allTopics.find((topic) => topic.slug === slug))
    .filter((topic): topic is (typeof allTopics)[number] => Boolean(topic));
  const questionGuides = getHomeQuestionGuides();
  const quickStarts = [
    {
      title: "先讲清核心概念",
      summary: "如果你一开口就容易卡在术语、接口测试分层或 Pytest/Playwright 基础，这里应该先补。",
      href: "/glossary",
      action: "进入术语与基础专题",
    },
    {
      title: "先收口项目表达",
      summary: "如果你做过项目但说不清亮点、指标和测试策略，应该先整理项目讲法和表达模板。",
      href: "/practice-template/project-story-template",
      action: "先看项目表达模板",
    },
    {
      title: "先练高频追问回答",
      summary: "如果你最怕面试官继续深挖支付回调、登录鉴权、重试和幂等，就先练场景题骨架。",
      href: "/scenario/payment-callback",
      action: "进入场景题模块",
    },
    {
      title: "我是新手",
      summary: "筛选所有入门级内容，从最基础的概念开始学起。",
      href: "/glossary?difficulty=beginner",
      action: "查看入门内容",
    },
  ];

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

      <OnboardingBanner />

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
          <h2>先拿下最常被追问的 6 个问题。</h2>
          <p>这一组不要按模块看，而要按“面试官最容易继续深挖什么”来准备。</p>
        </div>
        <div className="question-list">
          {hotQuestions.map((item, index) => {
            const guide = questionGuides.find((entry) => entry.slug === item.slug);

            return (
              <Link key={item.slug} href={`/${item.category}/${item.slug}`} className="question-item">
              <span className="question-index">0{index + 1}</span>
              <strong>{item.title}</strong>
              <p>{guide?.ask ?? item.summary}</p>
              <div className="question-answer-lead">
                <label>先讲什么</label>
                <span>{guide?.answerLead ?? item.summary}</span>
              </div>
              <span>{item.category} / {item.tags.slice(0, 2).join(" / ")}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <p className="eyebrow">准备重点</p>
          <h2>路线负责安排节奏，这一块只负责告诉你该先补什么。</h2>
          <p>不要重复按天数分流，而是先判断你现在缺的是概念、项目表达，还是高频追问回答。</p>
        </div>
        <div className="quickstart-grid">
          {quickStarts.map((item) => (
            <Link key={item.href} href={item.href} className="quickstart-card">
              <span className="module-kicker">建议入口</span>
              <strong>{item.title}</strong>
              <p>{item.summary}</p>
              <span className="quickstart-action">{item.action}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <p className="eyebrow">模块导航</p>
          <h2>需要系统补课时，再按模块展开阅读。</h2>
          <p>这里保留完整入口，但放到高频问题和起步分流之后，避免首屏过早变成目录页。</p>
        </div>
        <div className="module-stack">
          {orderedCategories.map((category) => {
            const items = allTopics.filter((topic) => topic.category === category).slice(0, 2);
            const recommendedSlug = getRecommendedEntry(category);
            const recommendedTopic = allTopics.find((topic) => topic.slug === recommendedSlug);

            return (
              <section key={category} className="module-row">
                <div className="module-meta">
                  <p className="module-kicker">{categoryConfig[category].navLabel}</p>
                  <h3>{categoryConfig[category].title}</h3>
                  <p>{categoryConfig[category].description}</p>
                  <Link href={categoryConfig[category].href}>进入模块</Link>
                  {recommendedTopic && (
                    <Link
                      href={`/${category}/${recommendedSlug}`}
                      className="recommended-entry"
                    >
                      推荐起点：{recommendedTopic.title}
                    </Link>
                  )}
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
