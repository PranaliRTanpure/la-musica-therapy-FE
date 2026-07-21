import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { FormTextField } from '@/components/form/FormTextField';
import { DEFAULT_ACCEPTED_FILE_TYPES, MB, validateFiles } from '@/utils/file';
import { FileDropzone } from './FileDropzone';
import { FilePreview } from './FilePreview';
import { FilePreviewModal } from './FilePreviewModal';

export interface UploadPayload {
  files: File[];
  documentName: string;
}

export interface UploadFileModalProps {
  open: boolean;
  onClose: () => void;
  /** Throw (or reject) to surface an inline "upload failed" message. */
  onUpload: (payload: UploadPayload) => void | Promise<void>;
  title?: string;
  description?: string;
  acceptedFileTypes?: readonly string[];
  maxFileSize?: number;
  allowMultiple?: boolean;
  showDocumentName?: boolean;
  nameLabel?: string;
  buttonText?: string;
  cancelText?: string;
  /** Pre-populates the picker, e.g. when re-opening to edit an upload. */
  defaultFile?: File | File[] | null;
  disabled?: boolean;
}

interface UploadFormValues {
  documentName: string;
  files: File[];
}

function toFileArray(defaultFile: UploadFileModalProps['defaultFile']): File[] {
  if (!defaultFile) return [];
  return Array.isArray(defaultFile) ? defaultFile : [defaultFile];
}

/**
 * Generic "upload a file" dialog: optional name field, a dropzone that becomes
 * a preview once a file is chosen, and footer actions. Carries no
 * document-specific logic — everything is configured through props.
 */
export function UploadFileModal({
  open,
  onClose,
  onUpload,
  title = 'Upload Document',
  description,
  acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES,
  maxFileSize = 5 * MB,
  allowMultiple = false,
  showDocumentName = true,
  nameLabel = 'Document Name',
  buttonText = 'Upload',
  cancelText = 'Cancel',
  defaultFile = null,
  disabled = false,
}: UploadFileModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const schema = useMemo(
    () =>
      z
        .object({
          documentName: z.string(),
          files: z
            .array(z.instanceof(File))
            .min(1, 'A file is required.')
            .superRefine((files, ctx) => {
              const error = validateFiles(files, {
                acceptedFileTypes,
                maxFileSize,
              });
              if (error) ctx.addIssue({ code: 'custom', message: error });
            }),
        })
        .superRefine((values, ctx) => {
          if (showDocumentName && values.documentName.trim() === '') {
            ctx.addIssue({
              code: 'custom',
              path: ['documentName'],
              message: 'Document name is required.',
            });
          }
        }),
    [acceptedFileTypes, maxFileSize, showDocumentName]
  );

  const defaultValues = useMemo<UploadFormValues>(
    () => ({ documentName: '', files: toFileArray(defaultFile) }),
    [defaultFile]
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const files = watch('files');

  // Discard the previous selection when the dialog opens. Keyed on the open
  // *transition*, not on `open` — a caller passing an inline `defaultFile`
  // array gives `defaultValues` a new identity each render, which would
  // otherwise reset the form (and loop) on every keystroke.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) reset(defaultValues);
    wasOpen.current = open;
  }, [open, reset, defaultValues]);

  const handleFilesSelected = useCallback(
    (selected: File[]) => {
      clearErrors('root');
      const next = allowMultiple ? [...files, ...selected] : selected;
      setValue('files', next, { shouldValidate: true, shouldDirty: true });
    },
    [allowMultiple, clearErrors, files, setValue]
  );

  const removeFile = useCallback(
    (target: File) => {
      setValue(
        'files',
        files.filter((file) => file !== target),
        { shouldValidate: true, shouldDirty: true }
      );
    },
    [files, setValue]
  );

  const onSubmit = async (values: UploadFormValues) => {
    try {
      await onUpload({
        files: values.files,
        documentName: values.documentName,
      });
      onClose();
    } catch (error) {
      setError('root', {
        message:
          error instanceof Error
            ? error.message
            : 'The upload failed. Please try again.',
      });
    }
  };

  const showDropzone = allowMultiple || files.length === 0;
  const busy = disabled || isSubmitting;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        aria-labelledby="upload-file-title"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogTitle
            id="upload-file-title"
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={(t) => ({ fontWeight: t.typography.fontWeightSemiBold })}
            >
              {title}
            </Typography>
            <IconButton onClick={onClose} aria-label="Close dialog" edge="end">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              {description ? (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              ) : null}

              {showDocumentName ? (
                <FormTextField
                  name="documentName"
                  control={control}
                  label={nameLabel}
                  placeholder={nameLabel}
                  required
                  disabled={busy}
                />
              ) : null}

              {files.map((file) => (
                <FilePreview
                  key={`${file.name}-${file.lastModified}-${file.size}`}
                  file={file}
                  disabled={busy}
                  onPreview={setPreviewFile}
                  onChange={() => removeFile(file)}
                  onDelete={() => removeFile(file)}
                />
              ))}

              {showDropzone ? (
                <FileDropzone
                  onFilesSelected={handleFilesSelected}
                  acceptedFileTypes={acceptedFileTypes}
                  maxFileSize={maxFileSize}
                  allowMultiple={allowMultiple}
                  disabled={busy}
                  error={Boolean(errors.files)}
                  helperText={errors.files?.message}
                />
              ) : null}

              {errors.root ? (
                <Alert severity="error">{errors.root.message}</Alert>
              ) : null}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2, gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {cancelText}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || busy}
            >
              {buttonText}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <FilePreviewModal
        open={Boolean(previewFile)}
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
}
