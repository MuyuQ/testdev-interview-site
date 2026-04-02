"use client";

import Link from "next/link";
import { useOnboarding } from "@/hooks/use-onboarding";

const recommendedTopics = [
  { slug: "api-assertion", title: "接口断言", category: "glossary" },
  { slug: "fixture", title: "Fixture", category: "glossary" },
  { slug: "idempotency", title: "幂等", category: "glossary" },
  { slug: "smoke-testing", title: "冒烟测试", category: "glossary" },
  { slug: "regression-testing", title: "回归测试", category: "glossary" },
];

export function OnboardingBanner() {
  const { isDismissed, dismiss } = useOnboarding();

  if (isDismissed) {
    return null;
  }

  return (
    <section className="onboarding-banner">
      <div className="onboarding-content">
        <h2>新手入门推荐</h2>
        <p>从这 5 个核心术语开始，建立测试开发知识骨架：</p>
        <div className="onboarding-links">
          {recommendedTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/${topic.category}/${topic.slug}`}
              className="onboarding-link"
            >
              {topic.title}
            </Link>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="onboarding-dismiss button-reset"
        onClick={dismiss}
        aria-label="关闭引导"
      >
        ×
      </button>
    </section>
  );
}
