"use client";

type ProgressBarProps = {
  current: number;
  total: number;
  label?: string;
  color?: "blue" | "green" | "yellow";
};

export function ProgressBar({
  current,
  total,
  label,
  color = "blue",
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="progress-bar-container">
      {label && (
        <div className="progress-bar-label">
          <span>{label}</span>
          <span className="progress-bar-value">
            {current}/{total} ({percentage}%)
          </span>
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill progress-bar-${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
