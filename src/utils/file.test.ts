import { describe, it, expect } from 'vitest';
import {
  DEFAULT_ACCEPTED_FILE_TYPES,
  MB,
  describeAcceptedTypes,
  formatFileSize,
  getFileExtension,
  getFileKind,
  resolveFileType,
  validateFile,
  validateFiles,
} from '@/utils/file';

/** Build a File whose reported size is `size`, without allocating it. */
function makeFile(name: string, type: string, size = 1): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

const OPTIONS = {
  acceptedFileTypes: DEFAULT_ACCEPTED_FILE_TYPES,
  maxFileSize: 5 * MB,
};

describe('formatFileSize', () => {
  it('renders zero and negative sizes as 0 B', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(-1)).toBe('0 B');
  });

  it('renders bytes without a decimal', () => {
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('renders a fractional kilobyte with one decimal', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('renders whole megabytes', () => {
    expect(formatFileSize(5 * MB)).toBe('5 MB');
  });

  it('drops the decimal once the value reaches 10', () => {
    expect(formatFileSize(10 * MB)).toBe('10 MB');
  });
});

describe('getFileExtension', () => {
  it('returns the lowercase extension', () => {
    expect(getFileExtension('Scan.PNG')).toBe('png');
  });

  it('returns an empty string when there is no extension', () => {
    expect(getFileExtension('receipt')).toBe('');
  });

  it('ignores a leading dot on a dotfile', () => {
    expect(getFileExtension('.gitignore')).toBe('');
  });

  it('uses only the final extension', () => {
    expect(getFileExtension('archive.tar.pdf')).toBe('pdf');
  });
});

describe('resolveFileType', () => {
  it('prefers the browser-reported MIME type', () => {
    expect(resolveFileType(makeFile('a.png', 'image/png'))).toBe('image/png');
  });

  it('falls back to the extension when the browser reports no type', () => {
    // Safari and some Android pickers report an empty `File.type`.
    expect(resolveFileType(makeFile('scan.pdf', ''))).toBe('application/pdf');
  });

  it('returns an empty string for an unknown extension and no type', () => {
    expect(resolveFileType(makeFile('notes.xyz', ''))).toBe('');
  });
});

describe('getFileKind', () => {
  it('classifies images', () => {
    expect(getFileKind('image/jpeg')).toBe('image');
  });

  it('classifies pdfs', () => {
    expect(getFileKind('application/pdf')).toBe('pdf');
  });

  it('classifies anything else as unknown', () => {
    expect(getFileKind('text/plain')).toBe('unknown');
  });
});

describe('describeAcceptedTypes', () => {
  it('joins the final type with "and"', () => {
    expect(describeAcceptedTypes(DEFAULT_ACCEPTED_FILE_TYPES)).toBe(
      'PNG, JPG and PDF'
    );
  });

  it('renders a single type without a conjunction', () => {
    expect(describeAcceptedTypes(['application/pdf'])).toBe('PDF');
  });

  it('collapses types that share a label', () => {
    // image/jpeg appearing twice must not produce "JPG and JPG".
    expect(describeAcceptedTypes(['image/jpeg', 'image/jpeg'])).toBe('JPG');
  });
});

describe('validateFile', () => {
  it('accepts a file within the type and size limits', () => {
    expect(validateFile(makeFile('a.png', 'image/png'), OPTIONS)).toBeNull();
  });

  it('rejects a disallowed type with a user-facing message', () => {
    expect(validateFile(makeFile('a.gif', 'image/gif'), OPTIONS)).toBe(
      'Only PNG, JPG and PDF files are allowed.'
    );
  });

  it('rejects a file over the size limit', () => {
    const file = makeFile('big.pdf', 'application/pdf', 5 * MB + 1);
    expect(validateFile(file, OPTIONS)).toBe(
      'File size exceeds the maximum limit of 5 MB.'
    );
  });

  it('accepts a file exactly at the size limit', () => {
    const file = makeFile('exact.pdf', 'application/pdf', 5 * MB);
    expect(validateFile(file, OPTIONS)).toBeNull();
  });

  it('rejects an empty file as corrupted', () => {
    const file = makeFile('empty.pdf', 'application/pdf', 0);
    expect(validateFile(file, OPTIONS)).toBe(
      'This file appears to be empty or corrupted.'
    );
  });

  it('accepts a typeless file whose extension is allowed', () => {
    expect(validateFile(makeFile('scan.pdf', ''), OPTIONS)).toBeNull();
  });

  it('honours a custom size limit in the message', () => {
    const file = makeFile('big.png', 'image/png', 2 * MB);
    expect(validateFile(file, { ...OPTIONS, maxFileSize: 1 * MB })).toBe(
      'File size exceeds the maximum limit of 1 MB.'
    );
  });
});

describe('validateFiles', () => {
  it('returns null when every file passes', () => {
    const files = [
      makeFile('a.png', 'image/png'),
      makeFile('b.pdf', 'application/pdf'),
    ];
    expect(validateFiles(files, OPTIONS)).toBeNull();
  });

  it('returns the first failure', () => {
    const files = [
      makeFile('a.png', 'image/png'),
      makeFile('b.gif', 'image/gif'),
    ];
    expect(validateFiles(files, OPTIONS)).toBe(
      'Only PNG, JPG and PDF files are allowed.'
    );
  });
});
