import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { ROUTES } from '@/config/routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
      {
        path: ROUTES.DASHBOARD,
        element: <PlaceholderPage title="Dashboard" />,
      },
      { path: ROUTES.CLIENTS, element: <PlaceholderPage title="Clients" /> },
      {
        path: ROUTES.SCHEDULING,
        element: <PlaceholderPage title="Scheduling" />,
      },
      {
        path: ROUTES.COMMUNICATION,
        element: <PlaceholderPage title="Communication" />,
      },
      { path: ROUTES.SETTINGS, element: <PlaceholderPage title="Settings" /> },
    ],
  },
]);
