export function getContentPath(id: string): string {
  return id.replace(/\.(md|mdx)$/i, "");
}

export function getContentParts(id: string): [category: string, slug: string] {
  const path = getContentPath(id);
  const [category = "", slug = ""] = path.split("/");

  return [category, slug];
}
