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
