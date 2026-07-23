import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppButton } from '@/components/common/AppButton';
import { CaptchaDisplay } from '@/components/common/CaptchaDisplay';
import { FormCheckbox } from '@/components/form/FormCheckbox';
import { FormPasswordField } from '@/components/form/FormPasswordField';
import { FormTextField } from '@/components/form/FormTextField';
import { AuthSplitLayout } from '@/components/layout/AuthSplitLayout';
import { layout } from '@/theme/theme';
import { ROUTES } from '@/config/routes';
import logo from '@/assets/logo-black.webp';
import { loginSchema, type LoginFormValues } from './loginSchema';

const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCaptchaCode() {
  let code = '';
  for (let i = 0; i < 5; i += 1) {
    code += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
  }
  return code;
}

export interface LoginPageProps {
  variant: 'patient' | 'provider';
}

const COPY = {
  patient: {
    title: 'Sign in to your account',
    subtitle: 'Use the temporary username and password from your invite email.',
  },
  provider: {
    title: 'Welcome back',
    subtitle: 'Sign in to manage your schedule, clients, and billing.',
  },
} as const;

export function LoginPage({ variant }: LoginPageProps) {
  const isPatient = variant === 'patient';
  const navigate = useNavigate();
  const [captchaCode, setCaptchaCode] = useState(generateCaptchaCode);

  const { control, handleSubmit, formState, setValue, setError } =
    useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: '',
        password: '',
        captcha: '',
        rememberMe: true,
      },
    });

  const refreshCaptcha = useCallback(() => {
    setCaptchaCode(generateCaptchaCode());
    setValue('captcha', '');
  }, [setValue]);

  const onSubmit = handleSubmit((values) => {
    // TODO: server-side captcha required before integration — this client-only
    // check is a UX guard, not a bot-prevention measure.
    if (isPatient && values.captcha.trim().toUpperCase() !== captchaCode) {
      setError('captcha', { message: 'Characters do not match' });
      refreshCaptcha();
      return;
    }
    // Both patient and provider variants land on the Clients route for now
    // (static screen, no API integration yet, per CLAUDE.md current-phase note).
    navigate(ROUTES.CLIENTS);
  });

  const { title, subtitle } = COPY[variant];

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
            {title}
          </Typography>
          <Typography
            variant="authPageSubtitle"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <FormTextField<LoginFormValues>
            name="email"
            control={control}
            label="Email"
            required
            placeholder="Enter Email"
            type="email"
            autoComplete="email"
          />

          <FormPasswordField<LoginFormValues>
            name="password"
            control={control}
            label="Temporary Password"
            required
            placeholder="Enter temporary password"
            autoComplete="current-password"
          />

          {isPatient && (
            <Stack spacing={0.75}>
              <Typography
                component="label"
                htmlFor="captcha"
                variant="body2"
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightSemiBold,
                  color: 'text.primary',
                })}
              >
                Captcha
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{ color: 'error.main', ml: 0.25 }}
                >
                  *
                </Box>
              </Typography>
              <CaptchaDisplay code={captchaCode} onRefresh={refreshCaptcha} />
              <FormTextField<LoginFormValues>
                name="captcha"
                control={control}
                id="captcha"
                required
                placeholder="Enter the characters above"
              />
            </Stack>
          )}

          {!isPatient && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormCheckbox<LoginFormValues>
                name="rememberMe"
                control={control}
                label="Remember me"
              />
              <Link
                component={RouterLink}
                to={ROUTES.FORGOT_PASSWORD}
                variant="body2"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Stack>
          )}
        </Stack>

        <AppButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={formState.isSubmitting}
        >
          {isPatient ? 'Continue' : 'Sign in'}
        </AppButton>
      </Stack>
    </AuthSplitLayout>
  );
}
