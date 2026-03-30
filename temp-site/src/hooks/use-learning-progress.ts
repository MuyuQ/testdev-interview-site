"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/lib/client/storage";

const STORAGE_KEY = "testdev:progress";

export function useLearningProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>(() =>
    readStorage<Record<string, boolean>>(STORAGE_KEY, {}),
  );

  const markProgress = useCallback((topicId: string) => {
    setProgress((current) => {
      const next = {
        ...current,
        [topicId]: !current[topicId],
      };

      writeStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return {
    progress,
    markProgress,
    isDone: (topicId: string) => !!progress[topicId],
  };
}
