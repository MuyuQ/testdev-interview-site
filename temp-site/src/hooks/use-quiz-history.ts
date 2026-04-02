"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/lib/client/storage";

type QuizResult = {
  topicSlug: string;
  question: string;
  rating: "good" | "average" | "poor";
  timestamp: string;
};

type QuizSession = {
  id: string;
  scope: string;
  count: number;
  results: QuizResult[];
  completedAt: string;
};

const STORAGE_KEY = "testdev:quiz-history";

export function useQuizHistory() {
  const [sessions, setSessions] = useState<QuizSession[]>(() =>
    readStorage<QuizSession[]>(STORAGE_KEY, []),
  );

  const saveSession = useCallback((session: QuizSession) => {
    setSessions((current) => {
      const next = [session, ...current].slice(0, 50);
      writeStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const getStats = useCallback(() => {
    const allResults = sessions.flatMap((s) => s.results);
    const good = allResults.filter((r) => r.rating === "good").length;
    const average = allResults.filter((r) => r.rating === "average").length;
    const poor = allResults.filter((r) => r.rating === "poor").length;
    const total = allResults.length;

    return {
      totalSessions: sessions.length,
      totalQuestions: total,
      good,
      average,
      poor,
      goodRate: total > 0 ? Math.round((good / total) * 100) : 0,
    };
  }, [sessions]);

  const clearHistory = useCallback(() => {
    setSessions([]);
    writeStorage(STORAGE_KEY, []);
  }, []);

  return {
    sessions,
    saveSession,
    getStats,
    clearHistory,
  };
}
