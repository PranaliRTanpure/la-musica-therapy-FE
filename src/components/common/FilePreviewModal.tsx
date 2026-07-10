import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { useTheme } from '@mui/material/styles';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useObjectUrl } from '@/hooks/useObjectUrl';
import { getFileKind, resolveFileType } from '@/utils/file';
import { ImagePreview } from './ImagePreview';
import { LazyPdfPreview } from './LazyPdfPreview';

const MIN_PDF_SCALE = 0.5;
const MAX_PDF_SCALE = 3;
const PDF_SCALE_STEP = 0.25;
/** Base render width for a PDF page, in CSS pixels, before `scale`. */
const PDF_BASE_WIDTH = 640;

export interface FilePreviewModalProps {
  open: boolean;
  file: File | null;
  onClose: () => void;
}

/**
 * Full-screen preview of a single file. Images pinch/scroll-zoom and pan; PDFs
 * render every page in a scrollable column with zoom controls.
 */
export function FilePreviewModal({
  open,
  file,
  onClose,
}: FilePreviewModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [pdfScale, setPdfScale] = useState(1);

  const kind = file ? getFileKind(resolveFileType(file)) : 'unknown';
  // PDFs go straight to pdf.js, so only images need a blob URL.
  const imageUrl = useObjectUrl(kind === 'image' ? file : null);

  // A newly-opened file starts at 100%, not the previous file's zoom.
  useEffect(() => {
    setPdfScale(1);
  }, [file]);

  const zoom = (delta: number) =>
    setPdfScale((current) =>
      Math.min(MAX_PDF_SCALE, Math.max(MIN_PDF_SCALE, current + delta))
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="lg"
      aria-labelledby="file-preview-title"
    >
      <DialogTitle
        id="file-preview-title"
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          noWrap
          sx={(t) => ({
            fontWeight: t.typography.fontWeightSemiBold,
            minWidth: 0,
          })}
        >
          {file?.name}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
          {kind === 'pdf' ? (
            <>
              <IconButton
                onClick={() => zoom(-PDF_SCALE_STEP)}
                disabled={pdfScale <= MIN_PDF_SCALE}
                aria-label="Zoom out"
              >
                <ZoomOutIcon />
              </IconButton>
              <IconButton
                onClick={() => zoom(PDF_SCALE_STEP)}
                disabled={pdfScale >= MAX_PDF_SCALE}
                aria-label="Zoom in"
              >
                <ZoomInIcon />
              </IconButton>
            </>
          ) : null}
          <IconButton onClick={onClose} aria-label="Close preview">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          bgcolor: 'background.default',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {!file ? null : kind === 'image' && imageUrl ? (
          <TransformWrapper doubleClick={{ mode: 'reset' }}>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%' }}
            >
              <ImagePreview
                src={imageUrl}
                alt={file.name}
                sx={{ mx: 'auto', maxHeight: '75svh' }}
              />
            </TransformComponent>
          </TransformWrapper>
        ) : kind === 'pdf' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <LazyPdfPreview
              file={file}
              allPages
              width={PDF_BASE_WIDTH}
              scale={pdfScale}
            />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
            No preview is available for this file type.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
