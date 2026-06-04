// localStorage 基础操作
const PREFIX = "testdev:"
export function get(key) { try { return localStorage.getItem(PREFIX + key) } catch { return null } }
export function set(key, value) { try { localStorage.setItem(PREFIX + key, value) } catch {} }
export function remove(key) { try { localStorage.removeItem(PREFIX + key) } catch {} }
