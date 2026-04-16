import { describe, it, expect, beforeEach } from "vitest";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
  toggleBookmark,
} from "../../src/lib/bookmark-store";

const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
  length: 0,
  key: (index: number) => Object.keys(mockStorage)[index] || null,
};

describe("bookmark-store", () => {
  beforeEach(() => {
    mockStorage["testdev:bookmarks"] = JSON.stringify([]);
  });

  it("should return empty bookmarks by default", () => {
    expect(getBookmarks()).toEqual([]);
  });

  it("should add bookmark", () => {
    addBookmark("api-assertion");
    expect(isBookmarked("api-assertion")).toBe(true);
  });

  it("should remove bookmark", () => {
    addBookmark("api-assertion");
    removeBookmark("api-assertion");
    expect(isBookmarked("api-assertion")).toBe(false);
  });

  it("should toggle bookmark", () => {
    expect(toggleBookmark("api-assertion")).toBe(true);
    expect(toggleBookmark("api-assertion")).toBe(false);
  });

  it("should limit to 20 bookmarks", () => {
    for (let i = 0; i < 25; i++) {
      addBookmark(`topic-${i}`);
    }
    expect(getBookmarks().length).toBe(20);
  });
});
