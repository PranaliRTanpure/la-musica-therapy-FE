import { useEffect, useState } from 'react';

/**
 * Create a blob object URL for a file and revoke it when the file changes or
 * the component unmounts. Returns `null` while there is no file.
 *
 * Object URLs pin the blob in memory until revoked, so never call
 * `URL.createObjectURL` inline in render — it leaks one URL per render.
 */
export function useObjectUrl(file: File | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}
