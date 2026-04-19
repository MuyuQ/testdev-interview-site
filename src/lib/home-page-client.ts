interface RecentView {
  slug: string;
  title: string;
  category: string;
  viewedAt?: string;
}

const KEY_PREFIX = "testdev:";

function loadRecentViews(): RecentView[] {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + "recent");
    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as RecentView[];
  } catch {
    return [];
  }
}

export function initializeRecentViews(base: string): void {
  const recent = loadRecentViews().slice(0, 5);
  const placeholder = document.getElementById("recent-placeholder");
  const list = placeholder?.parentElement;

  if (!list || recent.length === 0) {
    return;
  }

  list.innerHTML = "";

  recent.forEach((item) => {
    const li = document.createElement("li");
    li.style.cssText =
      "padding: var(--space-sm) 0; border-bottom: 1px solid var(--sl-color-hairline);";

    const link = document.createElement("a");
    link.href = `${base}${item.category}/${item.slug}/`;
    link.textContent = item.title;

    li.appendChild(link);
    list.appendChild(li);
  });
}
