"use client";

import { useLearningProgress } from "@/hooks/use-learning-progress";

type ProgressToggleProps = {
  topicId: string;
};

export function ProgressToggle({ topicId }: ProgressToggleProps) {
  const { isDone, markProgress } = useLearningProgress();
  const done = isDone(topicId);

  return (
    <button type="button" className="ghost-button" onClick={() => markProgress(topicId)}>
      {done ? "已标记完成" : "标记为已完成"}
    </button>
  );
}

