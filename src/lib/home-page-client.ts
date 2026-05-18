import { getRecentViewLabel, getRecentViews } from "./recent-views";

export function initializeRecentViews(base: string): void {
  const recent = getRecentViews(5);
  const list = document.getElementById("recent-views-list");

  if (!list) {
    return;
  }

  list.innerHTML = "";

  if (recent.length === 0) {
    const empty = document.createElement("li");
    empty.className = "recent-empty";
    empty.textContent = "还没有浏览记录，先打开一个主题吧。";
    list.appendChild(empty);
    return;
  }

  recent.forEach((item) => {
    const li = document.createElement("li");
    li.className = "recent-item";

    const icon = document.createElement("div");
    icon.className = "recent-item-icon";
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    `;

    const content = document.createElement("div");
    content.className = "recent-item-content";

    const link = document.createElement("a");
    link.className = "recent-item-title";
    link.href = `${base}${item.category}/${item.slug}/`;
    link.textContent = item.title;

    const meta = document.createElement("span");
    meta.className = "recent-item-meta";
    meta.textContent = getRecentViewLabel(item.category);

    content.append(link, meta);
    li.append(icon, content);
    list.appendChild(li);
  });
}
