"use client";

type DifficultyBadgeProps = {
  difficulty: "beginner" | "interview";
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const isBeginner = difficulty === "beginner";

  return (
    <span
      className={`difficulty-badge ${isBeginner ? "difficulty-beginner" : "difficulty-interview"}`}
      title={isBeginner ? "入门级内容" : "面试级内容"}
    >
      {isBeginner ? "入门" : "面试"}
    </span>
  );
}
