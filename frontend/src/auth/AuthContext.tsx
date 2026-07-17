import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { login as loginRequest } from '../api/auth';
import { borrarToken, guardarToken, obtenerToken } from '../api/client';
import type { UsuarioActual } from '../types/api';

const USUARIO_KEY = 'hx_usuario';

interface AuthContextValue {
  usuario: UsuarioActual | null;
  estaAutenticado: boolean;
  ingresar: (email: string, password: string) => Promise<void>;
  salir: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function usuarioGuardado(): UsuarioActual | null {
  const crudo = localStorage.getItem(USUARIO_KEY);
  if (!crudo) return null;
  try {
    return JSON.parse(crudo) as UsuarioActual;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioActual | null>(() =>
    obtenerToken() ? usuarioGuardado() : null,
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      estaAutenticado: usuario !== null,
      async ingresar(email: string, password: string) {
        const respuesta = await loginRequest(email, password);
        guardarToken(respuesta.accessToken);
        localStorage.setItem(USUARIO_KEY, JSON.stringify(respuesta.usuario));
        setUsuario(respuesta.usuario);
      },
      salir() {
        borrarToken();
        localStorage.removeItem(USUARIO_KEY);
        setUsuario(null);
      },
    }),
    [usuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
