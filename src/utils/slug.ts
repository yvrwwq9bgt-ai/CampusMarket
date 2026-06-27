export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fbf]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
