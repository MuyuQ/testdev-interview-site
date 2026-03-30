import Link from "next/link";
import { getTopicsByCategory } from "@/content";
import { categoryConfig, orderedCategories } from "@/lib/site-config";
import type { TopicCategory } from "@/content/types";

type SiteSidebarProps = {
  currentCategory?: TopicCategory;
};

export function SiteSidebar({ currentCategory }: SiteSidebarProps) {
  return (
    <aside className="site-sidebar">
      {orderedCategories.map((category) => {
        const config = categoryConfig[category];
        const topics = getTopicsByCategory(category);

        return (
          <section key={category} className="sidebar-section">
            <Link
              href={config.href}
              className={category === currentCategory ? "sidebar-heading active" : "sidebar-heading"}
            >
              {config.navLabel}
            </Link>
            <div className="sidebar-links">
              {topics.slice(0, 6).map((topic) => (
                <Link key={topic.slug} href={`/${topic.category}/${topic.slug}`}>
                  {topic.title}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </aside>
  );
}

