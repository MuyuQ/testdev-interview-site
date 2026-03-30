"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/lib/client/storage";

export type RecentItem = {
  slug: string;
  title: string;
  category: string;
  summary: string;
};

const STORAGE_KEY = "testdev:recent";

export function useRecentViews() {
  const [recentViews, setRecentViews] = useState<RecentItem[]>(() =>
    readStorage<RecentItem[]>(STORAGE_KEY, []),
  );

  const recordVisit = useCallback((item: RecentItem) => {
    setRecentViews((current) => {
      const deduped = current.filter(
        (entry) => !(entry.slug === item.slug && entry.category === item.category),
      );
      const next = [item, ...deduped].slice(0, 12);
      writeStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { recentViews, recordVisit };
}
