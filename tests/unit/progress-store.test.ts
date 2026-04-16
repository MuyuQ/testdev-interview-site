import { describe, it, expect, beforeEach } from "vitest";
import {
  getProgress,
  markAsCompleted,
  isCompleted,
  getCompletionCount,
  calculateProgressPercent,
} from "../../src/lib/progress-store";

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

describe("progress-store", () => {
  beforeEach(() => {
    mockStorage["testdev:progress"] = JSON.stringify({ completed: [] });
  });

  it("should return empty progress by default", () => {
    const progress = getProgress();
    expect(progress.completed).toEqual([]);
  });

  it("should mark topic as completed", () => {
    markAsCompleted("api-assertion", "glossary");
    expect(isCompleted("api-assertion", "glossary")).toBe(true);
  });

  it("should not duplicate completed entries", () => {
    markAsCompleted("api-assertion", "glossary");
    markAsCompleted("api-assertion", "glossary");
    expect(getCompletionCount()).toBe(1);
  });

  it("should calculate progress percent", () => {
    markAsCompleted("topic1", "glossary");
    markAsCompleted("topic2", "glossary");
    expect(calculateProgressPercent(4)).toBe(50);
  });

  it("should return 0 for empty total", () => {
    expect(calculateProgressPercent(0)).toBe(0);
  });
});
