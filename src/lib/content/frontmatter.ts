/**
 * Runtime validation for MDX frontmatter.
 *
 * gray-matter hands back untyped YAML, so every field is checked rather than
 * cast. A malformed file fails the build with a message naming the file and
 * the field, which is far easier to fix than a blank page at runtime.
 */

export class FrontmatterError extends Error {
  constructor(file: string, field: string, expected: string) {
    super(`Invalid frontmatter in "${file}": "${field}" must be ${expected}.`);
    this.name = "FrontmatterError";
  }
}

export function requireString(
  data: Record<string, unknown>,
  field: string,
  file: string,
): string {
  const value = data[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new FrontmatterError(file, field, "a non-empty string");
  }
  return value;
}

/** Missing, null and empty all normalise to `""`. */
export function optionalString(
  data: Record<string, unknown>,
  field: string,
  file: string,
): string {
  const value = data[field];
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") {
    throw new FrontmatterError(file, field, "a string if present");
  }
  return value;
}

/** Missing normalises to `[]`. Entries must all be strings. */
export function optionalStringArray(
  data: Record<string, unknown>,
  field: string,
  file: string,
): string[] {
  const value = data[field];
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new FrontmatterError(file, field, "an array of strings if present");
  }
  return value as string[];
}

export function optionalBoolean(
  data: Record<string, unknown>,
  field: string,
  file: string,
  fallback = false,
): boolean {
  const value = data[field];
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "boolean") {
    throw new FrontmatterError(file, field, "true or false if present");
  }
  return value;
}

export function requireOneOf<T extends string>(
  data: Record<string, unknown>,
  field: string,
  file: string,
  allowed: readonly T[],
): T {
  const value = data[field];
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new FrontmatterError(file, field, `one of: ${allowed.join(", ")}`);
  }
  return value as T;
}

/**
 * Accepts `YYYY-MM` or `YYYY-MM-DD`. gray-matter's YAML parser turns unquoted
 * dates into Date objects, so those are normalised back to a string here —
 * which is why frontmatter dates should be quoted, but need not be.
 */
export function requireDate(
  data: Record<string, unknown>,
  field: string,
  file: string,
): string {
  const value = data[field];
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value !== "string" || !/^\d{4}-\d{2}(-\d{2})?$/.test(value)) {
    throw new FrontmatterError(file, field, "a YYYY-MM or YYYY-MM-DD date");
  }
  return value;
}

/** Same as {@link requireDate} but allows `""` to signal "ongoing". */
export function optionalDate(
  data: Record<string, unknown>,
  field: string,
  file: string,
): string {
  const value = data[field];
  if (value === undefined || value === null || value === "") return "";
  return requireDate(data, field, file);
}
