import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedLayout } from './components/ProtectedLayout';
import { AuditoriaPage } from './pages/AuditoriaPage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmpleadosPage } from './pages/EmpleadosPage';
import { ImportarPage } from './pages/ImportarPage';
import { LoginPage } from './pages/LoginPage';
import { PeriodosPage } from './pages/PeriodosPage';
import { RegistroManualPage } from './pages/RegistroManualPage';
import { ReportePage } from './pages/ReportePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/importar" element={<ImportarPage />} />
              <Route path="/registro" element={<RegistroManualPage />} />
              <Route path="/reporte" element={<ReportePage />} />
              <Route path="/empleados" element={<EmpleadosPage />} />
              <Route path="/periodos" element={<PeriodosPage />} />
              <Route path="/configuracion" element={<ConfiguracionPage />} />
              <Route path="/auditoria" element={<AuditoriaPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
