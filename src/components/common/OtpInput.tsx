import { useRef } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export interface OtpInputProps {
  /** Current code value, e.g. `"123"` while the user is still typing. */
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: boolean;
  disabled?: boolean;
  id?: string;
}

/**
 * Base OTP input: `length` single-digit boxes with auto-advance/backspace
 * and paste-splitting. Form-agnostic and controlled by `value`/`onChange` —
 * usable standalone; the RHF `<Controller>` wrapping lives in `FormOtpInput`.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  error,
  disabled,
  id,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    setDigit(index, digit);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigit(index - 1, '');
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted.slice(0, length));
    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <Stack
      direction="row"
      spacing={1.5}
      id={id}
      role="group"
      aria-label="One-time code"
      sx={{ width: '100%' }}
    >
      {digits.map((digit, index) => (
        <TextField
          key={`otp-${index}`}
          inputRef={(el: HTMLInputElement | null) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          error={error}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          slotProps={{
            htmlInput: {
              maxLength: 1,
              'aria-label': `Digit ${index + 1} of ${length}`,
              sx: (theme) => ({
                textAlign: 'center',
                fontSize: theme.typography.otpDigit.fontSize,
                fontWeight: theme.typography.otpDigit.fontWeight,
                p: 0,
              }),
            },
          }}
          sx={(theme) => ({
            flex: 1,
            minWidth: 0,
            '& .MuiOutlinedInput-root': {
              height: { xs: 44, sm: 52 },
              backgroundColor: theme.palette.background.default,
            },
          })}
        />
      ))}
    </Stack>
  );
}
