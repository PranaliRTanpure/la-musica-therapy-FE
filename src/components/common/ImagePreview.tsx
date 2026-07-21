import { useState } from 'react';
import Box from '@mui/material/Box';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import type { SxProps, Theme } from '@mui/material/styles';

export interface ImagePreviewProps {
  /** Blob object URL from `useObjectUrl`, or a remote image URL. */
  src: string;
  alt: string;
  /** `cover` for thumbnails, `contain` for the full-screen viewer. */
  fit?: 'cover' | 'contain';
  sx?: SxProps<Theme>;
}

/**
 * Renders an image, degrading to a broken-image icon if it fails to decode.
 * Decoding is async and lazy so a large image never blocks the main thread.
 */
export function ImagePreview({
  src,
  alt,
  fit = 'contain',
  sx,
}: ImagePreviewProps) {
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
        <BrokenImageOutlinedIcon aria-label="Preview unavailable" />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      sx={[
        { display: 'block', maxWidth: '100%', height: 'auto', objectFit: fit },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
