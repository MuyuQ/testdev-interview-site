import { readStorage, writeStorage } from "./storage";

export interface ProgressEntry {
  slug: string;
  category: string;
  completedAt: string;
}

export interface ProgressData {
  completed: ProgressEntry[];
}

function getDefaults(): ProgressData {
  return { completed: [] };
}

export function getProgress(): ProgressData {
  return readStorage("progress", getDefaults());
}

export function markAsCompleted(slug: string, category: string): void {
  const data = getProgress();
  const existing = data.completed.findIndex(
    (e) => e.slug === slug && e.category === category,
  );
  if (existing >= 0) {
    data.completed[existing].completedAt = new Date().toISOString();
  } else {
    data.completed.push({
      slug,
      category,
      completedAt: new Date().toISOString(),
    });
  }
  writeStorage("progress", data);
}

export function isCompleted(slug: string, category: string): boolean {
  const data = getProgress();
  return data.completed.some((e) => e.slug === slug && e.category === category);
}

export function getCompletionCount(): number {
  return getProgress().completed.length;
}

export function calculateProgressPercent(total: number): number {
  if (total === 0) return 0;
  return Math.round((getCompletionCount() / total) * 100);
}

export function initializeCompletionControls(
  root: ParentNode = document,
): void {
  root
    .querySelectorAll<HTMLButtonElement>("[data-completion-button]")
    .forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      const slug = button.dataset.slug;
      const category = button.dataset.category;

      if (!slug || !category) {
        return;
      }

      const updateState = () => {
        const completed = isCompleted(slug, category);
        button.classList.toggle("completed", completed);
        button.setAttribute("aria-pressed", completed ? "true" : "false");
        button.textContent = completed ? "已完成" : "标记完成";
      };

      updateState();

      button.addEventListener("click", () => {
        markAsCompleted(slug, category);
        updateState();
      });

      button.dataset.bound = "true";
    });
}
