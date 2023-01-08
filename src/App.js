import React, { lazy, Suspense } from 'react';
import { useAuthContext } from './hooks/useAuthContext';
import LoginForm from './components/LoginForm';
import WarehouseLoader from './components/ui/WarehouseLoader';

const ADashboard = lazy(() => import('./views/Admin/ADashboard'));
const MDashboard = lazy(() => import('./views/Manager/MDashboard'));
const EDashboard = lazy(() => import('./views/Employee/EDashboard'));

function App() {
  const { user } = useAuthContext();
  return user ? (
    <Suspense fallback={<WarehouseLoader />}>
      {user.role === 'admin' && <ADashboard />}
      {user.role === 'manager' && <MDashboard />}
      {user.role === 'employee' && <EDashboard />}
    </Suspense>
  ) : (
    <LoginForm />
  );
}

export default App;
