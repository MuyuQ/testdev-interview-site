"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/lib/client/storage";

// 搜索历史项类型
export type SearchHistoryItem = {
  query: string; // 搜索关键词
  timestamp: string; // 搜索时间
  resultCount: number; // 结果数量
};

const STORAGE_KEY = "testdev:search-history";
const MAX_HISTORY_SIZE = 20;

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>(() =>
    readStorage<SearchHistoryItem[]>(STORAGE_KEY, []),
  );

  // 添加搜索历史（去重并限制数量）
  const addSearchHistory = useCallback((item: SearchHistoryItem) => {
    setHistory((current) => {
      // 去重：移除相同 query 的旧记录
      const deduped = current.filter((h) => h.query !== item.query);
      // 添加新记录到开头，并限制最大数量
      const next = [item, ...deduped].slice(0, MAX_HISTORY_SIZE);
      writeStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  // 获取搜索历史
  const getSearchHistory = useCallback(() => {
    return history;
  }, [history]);

  // 清空搜索历史
  const clearSearchHistory = useCallback(() => {
    setHistory([]);
    writeStorage(STORAGE_KEY, []);
  }, []);

  return {
    history,
    addSearchHistory,
    getSearchHistory,
    clearSearchHistory,
  };
}