// 收藏状态
import { get, set } from "./storage"
export function getBookmarks() { const d = get("bookmarks"); return d ? JSON.parse(d) : [] }
export function toggleBookmark(slug) { const b = getBookmarks(); const i = b.indexOf(slug); if (i >= 0) b.splice(i, 1); else b.push(slug); set("bookmarks", JSON.stringify(b)) }
