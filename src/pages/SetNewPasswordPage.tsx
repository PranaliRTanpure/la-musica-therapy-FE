import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppButton } from '@/components/common/AppButton';
import { FormPasswordField } from '@/components/form/FormPasswordField';
import { AuthSplitLayout } from '@/components/layout/AuthSplitLayout';
import { layout } from '@/theme/theme';
import { ROUTES } from '@/config/routes';
import logo from '@/assets/tfv-logo-black-white.png';
import {
  setNewPasswordSchema,
  type SetNewPasswordFormValues,
} from './setNewPasswordSchema';
import type { VerifyCodeLocationState } from './VerifyCodePage';

export function SetNewPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as VerifyCodeLocationState | null)?.email;

  const { control, handleSubmit, formState } =
    useForm<SetNewPasswordFormValues>({
      resolver: zodResolver(setNewPasswordSchema),
      defaultValues: { newPassword: '', confirmPassword: '' },
    });

  const onSubmit = handleSubmit(() => {
    // Static screen: no API integration yet, per CLAUDE.md current-phase note.
    navigate(ROUTES.PROVIDER_LOGIN);
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
            Set a new password
          </Typography>
          <Typography
            variant="authPageSubtitle"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Create a new password to secure your account and continue.
          </Typography>
        </Box>

        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <FormPasswordField<SetNewPasswordFormValues>
            name="newPassword"
            control={control}
            label="New Password"
            required
            placeholder="Create a new password"
            autoComplete="new-password"
          />

          <FormPasswordField<SetNewPasswordFormValues>
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            required
            placeholder="Re-enter your new password"
            autoComplete="new-password"
          />
        </Stack>

        <AppButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={formState.isSubmitting}
        >
          Reset password
        </AppButton>

        <Link
          component={RouterLink}
          to={ROUTES.VERIFY_CODE}
          state={{ email } satisfies VerifyCodeLocationState}
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
          Back
        </Link>
      </Stack>
    </AuthSplitLayout>
  );
}
