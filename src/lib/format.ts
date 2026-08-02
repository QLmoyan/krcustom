export function formatKRW(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("ko-KR");
}

/**
 * Accepts Date, ISO-ish strings, or already-Korean display strings.
 * Returns `YYYY.MM.DD` when parseable; otherwise returns trimmed input.
 */
export function formatKoreanDate(value: Date | string | number): string {
  const date = toDate(value);
  if (!date) {
    return typeof value === "string" ? value.trim() : "";
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

/**
 * Returns `YYYY.MM.DD HH:mm` when parseable.
 */
export function formatKoreanDateTime(value: Date | string | number): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    // Mock data often already uses Korean display format.
    if (/^\d{4}\.\d{2}\.\d{2}(?:\s+\d{1,2}:\d{2})?$/.test(trimmed)) {
      return trimmed;
    }
  }
  const date = toDate(value);
  if (!date) {
    return typeof value === "string" ? value.trim() : "";
  }
  const datePart = formatKoreanDate(date);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${datePart} ${hh}:${mm}`;
}

/** Normalize to `010-1234-5678` style when digits are sufficient. */
export function formatKoreanPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value.trim();
}

/** Mask middle digits: `010-****-5678`. */
export function maskPhoneNumber(value: string): string {
  const formatted = formatKoreanPhone(value);
  const digits = formatted.replace(/\D/g, "");
  if (digits.length >= 7) {
    const head = digits.slice(0, 3);
    const tail = digits.slice(-4);
    return `${head}-****-${tail}`;
  }
  return formatted;
}

export function formatOrderNumber(value: string): string {
  return value.trim().toUpperCase();
}

export function formatItemNumber(value: string): string {
  return value.trim().toUpperCase();
}

function toDate(value: Date | string | number): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const trimmed = value.trim();
  if (!trimmed) return null;

  const korean = trimmed.match(
    /^(\d{4})\.(\d{2})\.(\d{2})(?:\s+(\d{1,2}):(\d{2}))?$/,
  );
  if (korean) {
    const year = Number(korean[1]);
    const month = Number(korean[2]);
    const day = Number(korean[3]);
    const hour = Number(korean[4] ?? 0);
    const minute = Number(korean[5] ?? 0);
    const date = new Date(year, month - 1, day, hour, minute);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}
