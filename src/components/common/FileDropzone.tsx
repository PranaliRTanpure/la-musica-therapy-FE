import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { DragEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  DEFAULT_ACCEPTED_FILE_TYPES,
  MB,
  describeAcceptedTypes,
  formatFileSize,
} from '@/utils/file';

export interface FileDropzoneProps {
  /** Called with the dropped/browsed files. Validation is the caller's job. */
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes?: readonly string[];
  maxFileSize?: number;
  allowMultiple?: boolean;
  disabled?: boolean;
  /** Renders the zone in its error state and links `helperText` to it. */
  error?: boolean;
  /** Validation message or hint, announced to screen readers on error. */
  helperText?: ReactNode;
  /** Overrides the default "PNG, JPG and PDF up to 5 MB." hint. */
  description?: ReactNode;
  label?: string;
  browseLabel?: string;
  sx?: SxProps<Theme>;
}

/**
 * Drag-and-drop file input with a click/tap-to-browse fallback. Presentational
 * and controlled: it reports selected files and renders the error state its
 * caller passes down. The RHF binding lives in `FormFileDropzone`.
 */
export function FileDropzone({
  onFilesSelected,
  acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES,
  maxFileSize = 5 * MB,
  allowMultiple = false,
  disabled = false,
  error = false,
  helperText,
  description,
  label = 'Drop file here, or',
  browseLabel = 'click to browse',
  sx,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  // dragenter/dragleave fire for every child element, so track depth rather
  // than toggling on a single leave.
  const dragDepth = useRef(0);
  const helperId = useId();

  // Dropping a file anywhere outside the zone makes the browser navigate to
  // it, discarding app state. Suppress that while a dropzone is mounted.
  useEffect(() => {
    const prevent = (event: globalThis.DragEvent) => event.preventDefault();
    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', prevent);
    return () => {
      window.removeEventListener('dragover', prevent);
      window.removeEventListener('drop', prevent);
    };
  }, []);

  const emit = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      onFilesSelected(allowMultiple ? files : files.slice(0, 1));
    },
    [allowMultiple, onFilesSelected]
  );

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    // Required: without preventDefault the drop event never fires.
    event.preventDefault();
    if (!disabled && event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = 0;
    setDragging(false);
    if (disabled) return;
    // Some browsers expose no `files` on a non-file drag (e.g. dragged text).
    emit(event.dataTransfer?.files ?? null);
  };

  const hint =
    description ??
    `${describeAcceptedTypes(acceptedFileTypes)} up to ${formatFileSize(maxFileSize)}.`;

  return (
    <Stack spacing={0.75} sx={sx}>
      <Box
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-invalid={error || undefined}
        aria-describedby={helperText ? helperId : undefined}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          minHeight: { xs: '8.75rem', sm: '10rem' },
          px: 2,
          py: 3,
          textAlign: 'center',
          borderRadius: 2,
          border: 1,
          borderStyle: 'dashed',
          borderColor: error
            ? 'error.main'
            : dragging
              ? 'primary.main'
              : 'divider',
          bgcolor: dragging
            ? alpha(theme.palette.primary.main, 0.08)
            : 'background.default',
          color: disabled ? 'text.disabled' : 'text.secondary',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: theme.transitions.create([
            'border-color',
            'background-color',
          ]),
          '&:hover': disabled
            ? undefined
            : { borderColor: error ? 'error.main' : 'primary.main' },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        })}
      >
        <UploadFileOutlinedIcon
          fontSize="medium"
          aria-hidden
          sx={{ color: dragging ? 'primary.main' : 'inherit' }}
        />
        <Typography variant="body2" color="inherit">
          {dragging ? (
            'Drop to upload'
          ) : (
            <>
              {label}{' '}
              <Box
                component="span"
                sx={{
                  color: disabled ? 'text.disabled' : 'primary.main',
                  textDecoration: 'underline',
                }}
              >
                {browseLabel}
              </Box>
            </>
          )}
        </Typography>
        <Typography variant="caption" color="inherit">
          {hint}
        </Typography>

        <Box
          component="input"
          ref={inputRef}
          type="file"
          hidden
          disabled={disabled}
          multiple={allowMultiple}
          accept={acceptedFileTypes.join(',')}
          onChange={(event) => {
            emit(event.currentTarget.files);
            // Reset so re-picking the same file still fires `change`.
            event.currentTarget.value = '';
          }}
        />
      </Box>

      {helperText ? (
        <Typography
          id={helperId}
          variant="caption"
          color={error ? 'error.main' : 'text.secondary'}
          role={error ? 'alert' : undefined}
        >
          {helperText}
        </Typography>
      ) : null}
    </Stack>
  );
}
