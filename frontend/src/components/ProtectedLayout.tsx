import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PeriodoProvider } from '../periodos/PeriodoContext';
import { Sidebar } from './Sidebar';

export function ProtectedLayout() {
  const { estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PeriodoProvider>
      <div className="hx-shell">
        <Sidebar />
        <main className="hx-main">
          <Outlet />
        </main>
      </div>
    </PeriodoProvider>
  );
}
