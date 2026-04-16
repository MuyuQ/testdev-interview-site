export interface TermEntry {
  slug: string;
  term: string;
  shortDefinition: string;
}

const termRegistry: Map<string, TermEntry> = new Map();

export function registerTerm(entry: TermEntry): void {
  termRegistry.set(entry.slug, entry);
}

export function getTermBySlug(slug: string): TermEntry | undefined {
  return termRegistry.get(slug);
}

export function getAllTerms(): TermEntry[] {
  return Array.from(termRegistry.values());
}

export function hasTerm(slug: string): boolean {
  return termRegistry.has(slug);
}

export function registerTerms(terms: TermEntry[]): void {
  terms.forEach(registerTerm);
}
