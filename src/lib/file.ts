import type { UploadedFileCategory } from "@/types/UploadedFile";

const IMAGE_EXT = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "heic",
  "svg",
]);

const DESIGN_SOURCE_EXT = new Set(["psd", "ai", "eps"]);

const DOCUMENT_EXT = new Set(["doc", "docx", "txt", "rtf", "hwp", "hwpx"]);

const VIDEO_EXT = new Set(["mp4", "mov", "webm", "avi", "mkv"]);

const ARCHIVE_EXT = new Set(["zip", "rar", "7z", "tar", "gz"]);

export function getFileExtension(fileName: string): string {
  const trimmed = fileName.trim();
  const index = trimmed.lastIndexOf(".");
  if (index < 0 || index === trimmed.length - 1) return "";
  return trimmed.slice(index + 1).toLowerCase();
}

export function getFileCategory(
  fileNameOrExt: string,
  mimeType = "",
): UploadedFileCategory {
  const ext = fileNameOrExt.includes(".")
    ? getFileExtension(fileNameOrExt)
    : fileNameOrExt.toLowerCase().replace(/^\./, "");
  const mime = mimeType.toLowerCase();

  if (ext === "psd" || mime.includes("photoshop")) return "PSD";
  if (ext === "ai" || mime.includes("illustrator") || mime.includes("postscript")) {
    return "AI";
  }
  if (ext === "pdf" || mime === "application/pdf") return "PDF";
  if (IMAGE_EXT.has(ext) || mime.startsWith("image/")) return "IMAGE";
  if (VIDEO_EXT.has(ext) || mime.startsWith("video/")) return "VIDEO";
  if (ARCHIVE_EXT.has(ext) || mime.includes("zip") || mime.includes("rar")) {
    return "ARCHIVE";
  }
  if (DOCUMENT_EXT.has(ext) || mime.startsWith("text/")) return "DOCUMENT";
  if (DESIGN_SOURCE_EXT.has(ext)) return "OTHER";
  return "OTHER";
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0B";
  if (bytes < 1024) return `${Math.round(bytes)}B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb >= 10 ? Math.round(kb) : kb.toFixed(1)}KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)}MB`;
  const gb = mb / 1024;
  return `${gb >= 10 ? Math.round(gb) : gb.toFixed(1)}GB`;
}

export function isPreviewableImage(
  fileNameOrExt: string,
  mimeType = "",
): boolean {
  return getFileCategory(fileNameOrExt, mimeType) === "IMAGE";
}

export function isDesignSourceFile(
  fileNameOrExt: string,
  mimeType = "",
): boolean {
  const category = getFileCategory(fileNameOrExt, mimeType);
  return category === "PSD" || category === "AI";
}
