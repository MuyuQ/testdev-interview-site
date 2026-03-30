import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteSidebar } from "./site-sidebar";
import { TocNav, type TocItem } from "./toc-nav";
import type { TopicCategory } from "@/content/types";

type DocsFrameProps = {
  category?: TopicCategory;
  toc?: TocItem[];
  children: ReactNode;
};

export function DocsFrame({ category, toc = [], children }: DocsFrameProps) {
  return (
    <div className="docs-page">
      <SiteHeader />
      <div className="docs-layout">
        <SiteSidebar currentCategory={category} />
        <main className="docs-content">{children}</main>
        <aside className="docs-toc">
          <div className="docs-toc-inner">
            <p className="eyebrow">本页目录</p>
            <TocNav items={toc} />
            <div className="toc-footer">
              <p>先读高频问题与回答提示，再补充细节定义和案例。</p>
              <div className="toc-links">
                <a href="#page-top">回到顶部</a>
                <Link href="/roadmap">学习路线</Link>
                <Link href="/practice-template">模板库</Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
