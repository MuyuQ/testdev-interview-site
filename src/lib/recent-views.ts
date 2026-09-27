// 最近浏览
import { get, set } from "./storage";

interface RecentView {
  slug: string;
  title: string;
}

export function addRecentView(slug: string, title: string): void {
  const views = get("recent");
  const list: RecentView[] = views ? JSON.parse(views) : [];
  list.unshift({ slug, title });
  const filtered = list.filter(
    (v, i, a) => a.findIndex((x) => x.slug === v.slug) === i,
  );
  set("recent", JSON.stringify(filtered.slice(0, 10)));
}
