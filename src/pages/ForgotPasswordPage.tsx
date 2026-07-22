import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppButton } from '@/components/common/AppButton';
import { FormTextField } from '@/components/form/FormTextField';
import { AuthSplitLayout } from '@/components/layout/AuthSplitLayout';
import { layout } from '@/theme/theme';
import { ROUTES } from '@/config/routes';
import logo from '@/assets/tfv-logo-black-white.png';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from './forgotPasswordSchema';
import type { VerifyCodeLocationState } from './VerifyCodePage';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { control, handleSubmit, formState } =
    useForm<ForgotPasswordFormValues>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { email: '' },
    });

  const onSubmit = handleSubmit((values) => {
    // Static screen: no API integration yet, per CLAUDE.md current-phase note.
    const state: VerifyCodeLocationState = { email: values.email };
    navigate(ROUTES.VERIFY_CODE, { state });
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
            Forgot your password?
          </Typography>
          <Typography
            variant="authPageSubtitle"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Enter the email for your account and we&apos;ll send a verification
            code to reset your password.
          </Typography>
        </Box>

        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <FormTextField<ForgotPasswordFormValues>
            name="email"
            control={control}
            label="Email"
            required
            placeholder="name@lamusicatherapy.com"
            type="email"
            autoComplete="email"
          />
        </Stack>

        <AppButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={formState.isSubmitting}
        >
          Send reset code
        </AppButton>

        <Link
          component={RouterLink}
          to={ROUTES.PROVIDER_LOGIN}
          variant="body2"
          underline="hover"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            alignSelf: { xs: 'center', md: 'flex-start' },
          }}
        >
          <ArrowBackIcon fontSize="small" />
          Back to sign in
        </Link>
      </Stack>
    </AuthSplitLayout>
  );
}
