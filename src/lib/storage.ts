const KEY_PREFIX = "testdev:";

export function readStorage<T>(
  key: string,
  fallback: T,
  parse?: (raw: string) => T,
): T {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key);
    if (raw === null) return fallback;
    return parse ? parse(raw) : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or disabled
  }
}
