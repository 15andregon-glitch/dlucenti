export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function actionError(message: string) {
  return { ok: false as const, error: message };
}

export function actionSuccess<T extends Record<string, unknown> = Record<string, never>>(
  data?: T,
) {
  return { ok: true as const, ...data };
}

export type ActionResult<T = void> =
  | { ok: true }
  | { ok: false; error: string }
  | ({ ok: true } & T);

export function parseCheckbox(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true" || value === "1";
}

export function parseNumber(value: FormDataEntryValue | null, fallback = 0): number {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function parseOptionalUuid(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}
