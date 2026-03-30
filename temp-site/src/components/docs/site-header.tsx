import Link from "next/link";
import { getSearchIndex } from "@/content";
import { categoryConfig, orderedCategories } from "@/lib/site-config";
import { MobileNav } from "@/components/client/mobile-nav";
import { SearchLauncher } from "@/components/client/search-launcher";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-brand">
          <MobileNav
            categories={orderedCategories.map((key) => ({
              title: categoryConfig[key].title,
              href: categoryConfig[key].href,
            }))}
          />
          <Link href="/" className="brand-link">
            <span className="brand-badge">TD</span>
            <span>
              <strong>测试开发面试速成站</strong>
              <small>高频概念、项目打法与答题骨架</small>
            </span>
          </Link>
        </div>
        <div className="site-header-tools">
          <SearchLauncher searchIndex={getSearchIndex()} />
        </div>
      </div>
    </header>
  );
}

