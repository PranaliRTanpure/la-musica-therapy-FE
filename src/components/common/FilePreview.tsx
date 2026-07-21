import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import type { SxProps, Theme } from '@mui/material/styles';
import { useObjectUrl } from '@/hooks/useObjectUrl';
import { formatFileSize, getFileKind, resolveFileType } from '@/utils/file';
import { ImagePreview } from './ImagePreview';
import { LazyPdfPreview } from './LazyPdfPreview';

/** Thumbnail edge length, in CSS pixels (an icon-scale value, not layout). */
const THUMB_SIZE = 56;

export interface FilePreviewProps {
  file: File;
  /** Omit to hide the corresponding action button. */
  onPreview?: (file: File) => void;
  onChange?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * A chosen file as a thumbnail + metadata row with Preview / Change / Delete
 * actions. Detects the file kind and picks the renderer; unknown kinds get a
 * generic file icon rather than a broken preview.
 */
export function FilePreview({
  file,
  onPreview,
  onChange,
  onDelete,
  disabled = false,
  sx,
}: FilePreviewProps) {
  const kind = getFileKind(resolveFileType(file));
  const imageUrl = useObjectUrl(kind === 'image' ? file : null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const meta = [
    formatFileSize(file.size),
    kind === 'pdf' && pageCount
      ? `${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      sx={[
        {
          p: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          flexShrink: 0,
          alignSelf: { xs: 'center', sm: 'flex-start' },
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: 1,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          color: 'text.disabled',
        }}
      >
        {kind === 'image' && imageUrl ? (
          <ImagePreview
            src={imageUrl}
            alt={file.name}
            fit="cover"
            sx={{ width: '100%', height: '100%' }}
          />
        ) : kind === 'pdf' ? (
          <LazyPdfPreview
            file={file}
            width={THUMB_SIZE}
            onLoadSuccess={setPageCount}
          />
        ) : (
          <InsertDriveFileOutlinedIcon aria-hidden />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          noWrap
          title={file.name}
          sx={(theme) => ({ fontWeight: theme.typography.fontWeightSemiBold })}
        >
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {meta}
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={0.5}
        justifyContent={{ xs: 'center', sm: 'flex-end' }}
        sx={{ flexShrink: 0 }}
      >
        {onPreview ? (
          <Tooltip title="Preview">
            <span>
              <IconButton
                onClick={() => onPreview(file)}
                disabled={disabled}
                aria-label={`Preview ${file.name}`}
              >
                <VisibilityOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : null}
        {onChange ? (
          <Tooltip title="Change file">
            <span>
              <IconButton
                onClick={onChange}
                disabled={disabled}
                aria-label={`Change ${file.name}`}
              >
                <SwapHorizOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : null}
        {onDelete ? (
          <Tooltip title="Delete file">
            <span>
              <IconButton
                onClick={onDelete}
                disabled={disabled}
                aria-label={`Delete ${file.name}`}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : null}
      </Stack>
    </Stack>
  );
}
