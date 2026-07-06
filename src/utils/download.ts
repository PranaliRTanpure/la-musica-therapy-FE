import { saveAs } from 'file-saver';
import JSZip from 'jszip';

/** Download a Blob or a remote URL as a file. */
export async function downloadFile(
  source: Blob | string,
  filename: string
): Promise<void> {
  if (typeof source === 'string') {
    const res = await fetch(source);
    const blob = await res.blob();
    saveAs(blob, filename);
  } else {
    saveAs(source, filename);
  }
}

/** Zip multiple files and download. */
export async function downloadZip(
  files: { name: string; blob: Blob }[],
  zipName = 'download.zip'
): Promise<void> {
  const zip = new JSZip();
  files.forEach((f) => zip.file(f.name, f.blob));
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipName);
}
