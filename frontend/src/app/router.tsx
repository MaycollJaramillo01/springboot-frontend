import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/ui/AppShell';
import Dashboard from '@/pages/Dashboard';
import Pos from '@/pages/Pos';
import Products from '@/pages/Products';
import Customers from '@/pages/Customers';
import Invoices from '@/pages/Invoices';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />, 
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'pos', element: <Pos /> },
      { path: 'products', element: <Products /> },
      { path: 'customers', element: <Customers /> },
      { path: 'invoices', element: <Invoices /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> }
    ]
  }
]);
