"use client";

import { useEffect } from "react";
import type { RecentItem } from "@/hooks/use-recent-views";
import { useRecentViews } from "@/hooks/use-recent-views";

type RecentTrackerProps = {
  item: RecentItem;
};

export function RecentTracker({ item }: RecentTrackerProps) {
  const { recordVisit } = useRecentViews();

  useEffect(() => {
    recordVisit(item);
  }, [item, recordVisit]);

  return null;
}

