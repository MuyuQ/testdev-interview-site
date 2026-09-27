// localStorage 基础操作
const PREFIX = "testdev:";

export function get(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function set(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    // 存储不可用(如隐私模式)时静默失败
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // 存储不可用(如隐私模式)时静默失败
  }
}
