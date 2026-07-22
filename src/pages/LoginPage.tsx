import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AppButton } from '@/components/common/AppButton';
import { CaptchaDisplay } from '@/components/common/CaptchaDisplay';
import { FormPasswordField } from '@/components/form/FormPasswordField';
import { FormTextField } from '@/components/form/FormTextField';
import { AuthSplitLayout } from '@/components/layout/AuthSplitLayout';
import { layout } from '@/theme/theme';
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

export function LoginPage() {
  const [captchaCode, setCaptchaCode] = useState(generateCaptchaCode);

  const { control, handleSubmit, formState, setValue, setError } =
    useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: '', password: '', captcha: '' },
    });

  const refreshCaptcha = useCallback(() => {
    setCaptchaCode(generateCaptchaCode());
    setValue('captcha', '');
  }, [setValue]);

  const onSubmit = handleSubmit((values) => {
    // TODO: server-side captcha required before integration — this client-only
    // check is a UX guard, not a bot-prevention measure.
    if (values.captcha.trim().toUpperCase() !== captchaCode) {
      setError('captcha', { message: 'Characters do not match' });
      refreshCaptcha();
      return;
    }
    // Static screen: no API integration yet, per CLAUDE.md current-phase note.
  });

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
            Sign in to your account
          </Typography>
          <Typography
            variant="authPageSubtitle"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Use the temporary username and password from your invite email.
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
            placeholder="Password"
            autoComplete="current-password"
          />

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
        </Stack>

        <AppButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={formState.isSubmitting}
        >
          Continue
        </AppButton>
      </Stack>
    </AuthSplitLayout>
  );
}
