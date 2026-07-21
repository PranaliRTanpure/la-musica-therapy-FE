import { useState } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import type { SxProps, Theme } from '@mui/material/styles';
import { Document, Page } from '@/lib/pdf';

export interface PdfPreviewProps {
  file: File;
  /** Render every page (viewer) rather than only the first (thumbnail). */
  allPages?: boolean;
  /** Rendered page width in CSS pixels. */
  width?: number;
  /** Zoom multiplier applied to `width`. */
  scale?: number;
  onLoadSuccess?: (numPages: number) => void;
  sx?: SxProps<Theme>;
}

/**
 * pdf.js-backed PDF renderer. Falls back to a PDF icon when the document is
 * corrupt or the worker fails to load — never throws into the parent tree.
 *
 * Heavy: import this via `React.lazy` so pdf.js stays out of the main bundle.
 */
export function PdfPreview({
  file,
  allPages = false,
  width = 96,
  scale = 1,
  onLoadSuccess,
  sx,
}: PdfPreviewProps) {
  const [numPages, setNumPages] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <Box
        sx={[
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.disabled',
            bgcolor: 'background.default',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <PictureAsPdfOutlinedIcon aria-label="PDF preview unavailable" />
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      <Document
        file={file}
        onLoadSuccess={({ numPages: total }) => {
          setNumPages(total);
          onLoadSuccess?.(total);
        }}
        onLoadError={() => setFailed(true)}
        onSourceError={() => setFailed(true)}
        loading={
          <Skeleton variant="rectangular" width={width} height={width} />
        }
        error={
          <PictureAsPdfOutlinedIcon aria-label="PDF preview unavailable" />
        }
      >
        {allPages ? (
          Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={width * scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))
        ) : (
          <Page
            pageNumber={1}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        )}
      </Document>
    </Box>
  );
}
