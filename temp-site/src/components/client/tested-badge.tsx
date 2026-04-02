"use client";

import { useSelfTest } from "@/hooks/use-selftest";

type TestedBadgeProps = {
  topicSlug: string;
};

export function TestedBadge({ topicSlug }: TestedBadgeProps) {
  const { getRecord } = useSelfTest();
  const record = getRecord(topicSlug);

  if (!record) {
    return null;
  }

  const percentage = Math.round((record.score / record.total) * 100);
  const isGood = percentage >= 80;

  return (
    <span
      className={`tested-badge ${isGood ? "tested-good" : "tested-needs-work"}`}
      title={`上次得分：${record.score}/${record.total} (${percentage}%)`}
    >
      {percentage}%
    </span>
  );
}
