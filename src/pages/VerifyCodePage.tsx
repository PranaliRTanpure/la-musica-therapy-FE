import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppButton } from '@/components/common/AppButton';
import { FormOtpInput } from '@/components/form/FormOtpInput';
import { AuthSplitLayout } from '@/components/layout/AuthSplitLayout';
import { layout } from '@/theme/theme';
import { ROUTES } from '@/config/routes';
import logo from '@/assets/logo-black.webp';
import {
  verifyCodeSchema,
  OTP_LENGTH,
  type VerifyCodeFormValues,
} from './verifyCodeSchema';

export interface VerifyCodeLocationState {
  email?: string;
}

export function VerifyCodePage() {
  const location = useLocation();
  const email = (location.state as VerifyCodeLocationState | null)?.email;

  const { control, handleSubmit, formState, watch } =
    useForm<VerifyCodeFormValues>({
      resolver: zodResolver(verifyCodeSchema),
      defaultValues: { code: '' },
    });

  const code = watch('code');

  const [resendMessageVisible, setResendMessageVisible] = useState(false);

  const onSubmit = handleSubmit(() => {
    // Static screen: no API integration yet, per CLAUDE.md current-phase note.
  });

  const handleResendCode = () => {
    // Static screen: no API integration yet, per CLAUDE.md current-phase note.
    setResendMessageVisible(true);
  };

  return (
    <AuthSplitLayout>
      <Stack
        component="form"
        onSubmit={onSubmit}
        spacing={2}
        sx={{ width: '100%', maxWidth: layout.authFormMaxWidth }}
      >
        <Box sx={{ alignSelf: { xs: 'center', md: 'flex-start' } }}>
          <Box
            component="img"
            src={logo}
            alt="LA Musica Therapy"
            sx={{ height: 48, width: 'auto', display: 'block', pl: 2 }}
          />
        </Box>

        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="authPageTitle" component="h1">
            Two-factor authentication
          </Typography>
          <Typography
            variant="authPageSubtitle"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Enter the 6-digit code we sent to{' '}
            {email ? (
              <Box
                component="span"
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightSemiBold,
                  color: 'text.primary',
                })}
              >
                {email}
              </Box>
            ) : (
              <Box
                component="span"
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightSemiBold,
                  color: 'text.primary',
                })}
              >
                your email
              </Box>
            )}{' '}
            to finish signing in.
          </Typography>
        </Box>

        <Stack spacing={1} sx={{ mt: 1 }}>
          <FormOtpInput<VerifyCodeFormValues>
            name="code"
            control={control}
            length={OTP_LENGTH}
          />
          {resendMessageVisible && (
            <Typography variant="caption" color="success.main">
              A new code has been sent.
            </Typography>
          )}
        </Stack>

        <AppButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={formState.isSubmitting}
          disabled={code.length !== OTP_LENGTH}
        >
          Verify code
        </AppButton>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Link
            component={RouterLink}
            to={ROUTES.FORGOT_PASSWORD}
            variant="body2"
            underline="hover"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            <ArrowBackIcon fontSize="small" />
            Back
          </Link>
          <Link
            component="button"
            type="button"
            variant="body2"
            underline="hover"
            onClick={handleResendCode}
          >
            Resend code
          </Link>
        </Stack>
      </Stack>
    </AuthSplitLayout>
  );
}
