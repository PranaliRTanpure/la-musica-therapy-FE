/** One megabyte in bytes. Use for `maxFileSize` props: `5 * MB`. */
export const MB = 1024 * 1024;

/** The file types the app accepts by default: PNG, JPG and PDF. */
export const DEFAULT_ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
] as const;

/** Broad category a preview component can render. */
export type FileKind = 'image' | 'pdf' | 'unknown';

export interface FileValidationOptions {
  acceptedFileTypes: readonly string[];
  maxFileSize: number;
}

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;

const MIME_LABELS: Record<string, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'application/pdf': 'PDF',
};

/** Extension → MIME, for browsers that report an empty `File.type`. */
const EXTENSION_MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  pdf: 'application/pdf',
};

/** Human-readable byte size, e.g. `5 MB`, `1.5 KB`, `0 B`. */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    SIZE_UNITS.length - 1
  );
  const value = bytes / 1024 ** exponent;
  // Whole numbers for bytes and for anything >= 10; one decimal otherwise.
  const rounded =
    exponent === 0 || value >= 10
      ? Math.round(value)
      : Math.round(value * 10) / 10;
  return `${rounded} ${SIZE_UNITS[exponent]}`;
}

/** Lowercase extension without the dot, or `''` when there isn't one. */
export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot < 1 || lastDot === fileName.length - 1) return '';
  return fileName.slice(lastDot + 1).toLowerCase();
}

/**
 * The file's MIME type. Safari and some Windows/Android pickers hand back an
 * empty `type`, so fall back to the extension rather than rejecting the file.
 */
export function resolveFileType(file: File): string {
  if (file.type) return file.type;
  return EXTENSION_MIME[getFileExtension(file.name)] ?? '';
}

/** Which preview renderer a MIME type needs. */
export function getFileKind(mimeType: string): FileKind {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'unknown';
}

/** `['image/png','image/jpeg','application/pdf']` → `'PNG, JPG and PDF'`. */
export function describeAcceptedTypes(
  acceptedFileTypes: readonly string[]
): string {
  const labels = [
    ...new Set(
      acceptedFileTypes.map(
        (type) =>
          MIME_LABELS[type] ?? type.split('/').pop()?.toUpperCase() ?? type
      )
    ),
  ];
  if (labels.length === 0) return '';
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
}

/**
 * Validate one file against the accepted types and size limit.
 * Returns a user-facing message, or `null` when the file is acceptable.
 */
export function validateFile(
  file: File,
  { acceptedFileTypes, maxFileSize }: FileValidationOptions
): string | null {
  const type = resolveFileType(file);

  if (!type || !acceptedFileTypes.includes(type)) {
    return `Only ${describeAcceptedTypes(acceptedFileTypes)} files are allowed.`;
  }
  if (file.size > maxFileSize) {
    return `File size exceeds the maximum limit of ${formatFileSize(maxFileSize)}.`;
  }
  if (file.size === 0) {
    return 'This file appears to be empty or corrupted.';
  }
  return null;
}

/** Validate a batch; returns the first error found, or `null`. */
export function validateFiles(
  files: readonly File[],
  options: FileValidationOptions
): string | null {
  for (const file of files) {
    const error = validateFile(file, options);
    if (error) return error;
  }
  return null;
}
