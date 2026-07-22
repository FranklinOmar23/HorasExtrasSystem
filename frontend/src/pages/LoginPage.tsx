import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { mensajeError } from '../api/client';
import { Spinner } from '../components/Spinner';

export function LoginPage() {
  const { estaAutenticado, ingresar } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  if (estaAutenticado) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await ingresar(email, password);
    } catch (err) {
      setError(mensajeError(err, 'No se pudo iniciar sesión.'));
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="hx-login">
      <div className="hx-login-form">
        <div style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div className="hx-logo" style={{ width: 44, height: 44, fontSize: 20 }}>H</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, lineHeight: 1, letterSpacing: '-.02em' }}>
                Hartemanía
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginTop: 4 }}>
                Horas Extras
              </div>
            </div>
          </div>
          <div className="hx-eyebrow" style={{ marginBottom: 10 }}>Acceso interno · RRHH</div>
          <h1 style={{ fontSize: 32, margin: '0 0 8px' }}>Inicia sesión</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 28px', fontSize: 15 }}>
            Sistema de cálculo y pago de horas extras por quincena.
          </p>
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label className="hx-label">
              Correo electrónico
              <input
                className="hx-in"
                style={{ height: 46 }}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="hx-label">
              Contraseña
              <input
                className="hx-in"
                style={{ height: 46 }}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && (
              <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>
                {error}
              </div>
            )}
            <button type="submit" className="hx-btn hx-btn-primary" style={{ marginTop: 8, height: 48, fontSize: 16 }} disabled={cargando}>
              {cargando && <Spinner />}
              {cargando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
          <div style={{ marginTop: 40, fontSize: 12, color: 'var(--text-tertiary)' }}>
            Hecho en RD 🇩🇴 · v1.0 · © 2026 Hartemanía
          </div>
        </div>
      </div>
      <div className="hx-login-visual">
        <div style={{ position: 'absolute', top: -120, right: -120, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,90,60,.35), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -140, left: -100, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,160,143,.4), transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--c-sun-400)', marginBottom: 18 }}>
            Del Excel al pago, sin friction
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, lineHeight: 1.05, letterSpacing: '-.02em' }}>
            Horas extras claras, pagos exactos.
          </div>
          <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.75)' }}>
            Importa, valida, calcula y cierra la quincena con trazabilidad completa —
            cada cálculo queda congelado con el porcentaje y el salario/hora usados.
          </p>
        </div>
      </div>
    </div>
  );
}
