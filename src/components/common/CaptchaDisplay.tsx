import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CachedIcon from '@mui/icons-material/Cached';

export interface CaptchaDisplayProps {
  /** The captcha challenge text to render (e.g. "8AE4J"). */
  code: string;
  /** Called when the user asks for a new challenge. */
  onRefresh: () => void;
  disabled?: boolean;
}

// Fixed per-character tilt/offset pattern (not random) so each character
// reads as hand-jittered like a real captcha, without changing on re-render.
const CHAR_TRANSFORMS = [
  'rotate(-8deg)',
  'rotate(6deg) translateY(-2px)',
  'rotate(-4deg) translateY(2px)',
  'rotate(9deg)',
  'rotate(-6deg) translateY(-1px)',
  'rotate(4deg)',
];

// Presentational only — the answer is validated by the caller, not here.
export function CaptchaDisplay({
  code,
  onRefresh,
  disabled,
}: CaptchaDisplayProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        role="img"
        aria-label={`Captcha challenge: ${code.split('').join(' ')}`}
        sx={(theme) => ({
          flex: 1,
          minWidth: 0,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          bgcolor: 'background.default',
          border: `1px solid ${theme.palette.divider}`,
          backgroundImage: `repeating-linear-gradient(135deg, ${theme.palette.action.hover} 0px, ${theme.palette.action.hover} 2px, transparent 2px, transparent 10px)`,
          userSelect: 'none',
        })}
      >
        <Stack direction="row" spacing={1.25} aria-hidden="true">
          {code.split('').map((char, index) => (
            <Typography
              key={`${char}-${index}`}
              component="span"
              variant="captchaChar"
              sx={{
                color: 'text.primary',
                display: 'inline-block',
                transform: CHAR_TRANSFORMS[index % CHAR_TRANSFORMS.length],
              }}
            >
              {char}
            </Typography>
          ))}
        </Stack>
      </Box>
      <IconButton
        aria-label="Refresh captcha"
        onClick={onRefresh}
        disabled={disabled}
        sx={(theme) => ({
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
        })}
      >
        <CachedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
