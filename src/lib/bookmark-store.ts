import { readStorage, writeStorage } from "./storage";

const MAX_BOOKMARKS = 20;

export function getBookmarks(): string[] {
  return readStorage("bookmarks", []);
}

export function addBookmark(slug: string): void {
  const bookmarks = getBookmarks();
  if (!bookmarks.includes(slug)) {
    if (bookmarks.length >= MAX_BOOKMARKS) {
      bookmarks.shift();
    }
    bookmarks.push(slug);
    writeStorage("bookmarks", bookmarks);
  }
}

export function removeBookmark(slug: string): void {
  const bookmarks = getBookmarks().filter((s) => s !== slug);
  writeStorage("bookmarks", bookmarks);
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().includes(slug);
}

export function toggleBookmark(slug: string): boolean {
  if (isBookmarked(slug)) {
    removeBookmark(slug);
    return false;
  } else {
    addBookmark(slug);
    return true;
  }
}

export function initializeBookmarkButtons(root: ParentNode = document): void {
  root
    .querySelectorAll<HTMLButtonElement>(".bookmark-btn[data-slug]")
    .forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      const slug = button.dataset.slug;
      if (!slug) {
        return;
      }

      const updateState = (marked: boolean) => {
        button.classList.toggle("bookmarked", marked);
        button.setAttribute("aria-label", marked ? "取消收藏" : "添加收藏");
        button.setAttribute("aria-pressed", String(marked));
      };

      updateState(isBookmarked(slug));

      button.addEventListener("click", () => {
        updateState(toggleBookmark(slug));
      });

      button.dataset.bound = "true";
    });
}
