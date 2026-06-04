// 学习进度状态
import { get, set } from "./storage"
export function getProgress() { const d = get("progress"); return d ? JSON.parse(d) : { total: 0, completed: 0, completedSlugs: [] } }
export function markComplete(slug) { const prog = getProgress(); if (!prog.completedSlugs.includes(slug)) { prog.completedSlugs.push(slug); prog.completed = prog.completedSlugs.length; set("progress", JSON.stringify(prog)) } }
