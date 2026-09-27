// 学习进度状态
import { get, set } from "./storage";

export interface ProgressData {
  total: number;
  completed: number;
  completedSlugs: string[];
}

export function getProgress(): ProgressData {
  const d = get("progress");
  return d ? JSON.parse(d) : { total: 0, completed: 0, completedSlugs: [] };
}

export function markComplete(slug: string): void {
  const prog = getProgress();
  if (!prog.completedSlugs.includes(slug)) {
    prog.completedSlugs.push(slug);
    prog.completed = prog.completedSlugs.length;
    set("progress", JSON.stringify(prog));
  }
}
