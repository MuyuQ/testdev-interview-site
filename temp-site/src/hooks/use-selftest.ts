"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/lib/client/storage";
import type { SelfTestRecord } from "@/content/types";

const STORAGE_KEY = "testdev:selftest-records";

export function useSelfTest() {
  const [records, setRecords] = useState<SelfTestRecord[]>(() =>
    readStorage<SelfTestRecord[]>(STORAGE_KEY, []),
  );

  const saveRecord = useCallback((topicSlug: string, score: number, total: number) => {
    setRecords((current) => {
      const filtered = current.filter((r) => r.topicSlug !== topicSlug);
      const newRecord: SelfTestRecord = {
        topicSlug,
        score,
        total,
        completedAt: new Date().toISOString(),
      };
      const next = [...filtered, newRecord];
      writeStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const getRecord = useCallback(
    (topicSlug: string): SelfTestRecord | undefined => {
      return records.find((r) => r.topicSlug === topicSlug);
    },
    [records]
  );

  const clearRecords = useCallback(() => {
    setRecords([]);
    writeStorage(STORAGE_KEY, []);
  }, []);

  const getAverageScore = useCallback((): number => {
    if (records.length === 0) return 0;
    const total = records.reduce((sum, r) => sum + (r.score / r.total), 0);
    return Math.round((total / records.length) * 100);
  }, [records]);

  return {
    records,
    saveRecord,
    getRecord,
    clearRecords,
    getAverageScore,
    testedCount: records.length,
  };
}
