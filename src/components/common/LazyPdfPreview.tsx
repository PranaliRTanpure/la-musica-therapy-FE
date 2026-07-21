import { Suspense, lazy } from 'react';
import Skeleton from '@mui/material/Skeleton';
import type { PdfPreviewProps } from './PdfPreview';

const PdfPreview = lazy(() =>
  import('./PdfPreview').then((module) => ({ default: module.PdfPreview }))
);

/**
 * `PdfPreview` behind a `React.lazy` boundary, so pdf.js (~350 KB) is fetched
 * only when a PDF is actually previewed. Use this everywhere instead of
 * importing `PdfPreview` directly.
 */
export function LazyPdfPreview(props: PdfPreviewProps) {
  const { width = 96 } = props;
  return (
    <Suspense
      fallback={<Skeleton variant="rectangular" width={width} height={width} />}
    >
      <PdfPreview {...props} />
    </Suspense>
  );
}
