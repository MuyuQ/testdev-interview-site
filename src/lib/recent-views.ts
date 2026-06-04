// 最近浏览
import { get, set } from "./storage"
export function addRecentView(slug, title) { const views = get("recent"); const list = views ? JSON.parse(views) : []; list.unshift({ slug, title }); const filtered = list.filter((v, i, a) => a.findIndex(x => x.slug === v.slug) === i); set("recent", JSON.stringify(filtered.slice(0, 10))) }
