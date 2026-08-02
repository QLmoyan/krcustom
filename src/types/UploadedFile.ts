export type UploadedFileCategory =
  | "IMAGE"
  | "PSD"
  | "AI"
  | "PDF"
  | "DOCUMENT"
  | "VIDEO"
  | "ARCHIVE"
  | "OTHER";

export type UploadedFileStatus =
  | "PENDING"
  | "UPLOADING"
  | "READY"
  | "FAILED"
  | "DELETED";

export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
  category: UploadedFileCategory;
  url: string;
  thumbnailUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  status: UploadedFileStatus;
}
