export function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Strips characters that would break a PostgREST `.or()` filter string
// (commas separate conditions, parentheses group them) so free-text search
// input can never be interpreted as filter syntax.
export function sanitizeSearchTerm(raw: string): string {
  return raw.replace(/[,()"]/g, " ").trim();
}
