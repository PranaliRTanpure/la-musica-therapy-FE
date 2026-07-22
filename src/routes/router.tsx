import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { ClientsPage } from '@/features/clients/ClientsPage';
import { AddLeadPage } from '@/features/leads/AddLeadPage';
import { PatientChartingPage } from '@/features/patients/PatientChartingPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { AvailabilityPage } from '@/features/availability/AvailabilityPage';
import { AvailabilityPreferencesPage } from '@/features/availability/AvailabilityPreferencesPage';
import { HolidaysPage } from '@/features/holidays/HolidaysPage';
import { LoginPage } from '@/pages/LoginPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { VerifyCodePage } from '@/pages/VerifyCodePage';
import { ROUTES } from '@/config/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Navigate to={ROUTES.PATIENT_LOGIN} replace />,
  },
  { path: ROUTES.PATIENT_LOGIN, element: <LoginPage variant="patient" /> },
  { path: ROUTES.PROVIDER_LOGIN, element: <LoginPage variant="provider" /> },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.VERIFY_CODE,
    element: <VerifyCodePage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.LOGIN} replace /> },
      {
        path: ROUTES.DASHBOARD,
        element: <PlaceholderPage title="Dashboard" />,
      },
      { path: ROUTES.CLIENTS, element: <ClientsPage /> },
      { path: ROUTES.LEADS_NEW, element: <AddLeadPage /> },
      { path: ROUTES.LEADS_DETAIL, element: <AddLeadPage /> },
      { path: ROUTES.PATIENT_CHART, element: <PatientChartingPage /> },
      {
        path: ROUTES.SCHEDULING,
        element: <PlaceholderPage title="Scheduling" />,
      },
      {
        path: ROUTES.COMMUNICATION,
        element: <PlaceholderPage title="Communication" />,
      },
      { path: ROUTES.SETTINGS, element: <SettingsPage /> },
      { path: ROUTES.SETTINGS_AVAILABILITY, element: <AvailabilityPage /> },
      {
        path: ROUTES.SETTINGS_AVAILABILITY_DETAIL,
        element: <AvailabilityPreferencesPage />,
      },
      { path: ROUTES.SETTINGS_HOLIDAYS, element: <HolidaysPage /> },
      {
        path: ROUTES.SETTINGS_ROLES,
        element: <PlaceholderPage title="Roles and Permission" />,
      },
      {
        path: ROUTES.SETTINGS_INSURERS,
        element: <PlaceholderPage title="Insurers" />,
      },
      {
        path: ROUTES.SETTINGS_PROCEDURAL_CODES,
        element: <PlaceholderPage title="Procedural Codes" />,
      },
    ],
  },
]);
