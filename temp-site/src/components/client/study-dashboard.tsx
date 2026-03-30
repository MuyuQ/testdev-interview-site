"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/use-favorites";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { useRecentViews } from "@/hooks/use-recent-views";

export function StudyDashboard() {
  const { favorites } = useFavorites();
  const { progress } = useLearningProgress();
  const { recentViews } = useRecentViews();
  const completedCount = Object.values(progress).filter(Boolean).length;

  return (
    <section className="home-section">
      <div className="section-head">
        <p className="eyebrow">本地学习进度</p>
        <h2>收藏、完成状态和最近浏览都会保留在当前设备。</h2>
        <p>不需要账号系统，适合临近面试前快速回看。</p>
      </div>

      <div className="study-grid">
        <article className="content-block">
          <div className="content-block-head">
            <h2>完成进度</h2>
            <p>你已经标记完成了 {completedCount} 个节点。</p>
          </div>
        </article>

        <article className="content-block">
          <div className="content-block-head">
            <h2>最近浏览</h2>
            <p>继续从你刚刚看到的主题接着学。</p>
          </div>
          <div className="content-block-body">
            <div className="recent-list">
              {recentViews.length ? (
                recentViews.map((item) => (
                  <Link key={`${item.category}-${item.slug}`} href={`/${item.category}/${item.slug}`}>
                    {item.title}
                  </Link>
                ))
              ) : (
                <p className="eyebrow">还没有浏览记录。</p>
              )}
            </div>
          </div>
        </article>

        <article className="content-block">
          <div className="content-block-head">
            <h2>已收藏</h2>
            <p>把高频模板和重点专题先收藏起来。</p>
          </div>
          <div className="content-block-body">
            <div className="recent-list">
              {favorites.length ? (
                favorites.map((item) => (
                  <Link key={`${item.category}-${item.slug}`} href={`/${item.category}/${item.slug}`}>
                    {item.title}
                  </Link>
                ))
              ) : (
                <p className="eyebrow">还没有收藏内容。</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

