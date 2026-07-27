import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { crearEmpleado } from '../api/empleados';
import { mensajeError } from '../api/client';
import type { Empleado } from '../types/api';
import { Spinner } from './Spinner';

export function EmpleadoNuevoModal({
  codigo,
  nombreSugerido,
  vigenteDesdePorDefecto,
  posicionActual,
  total,
  onGuardado,
  onOmitir,
  onCerrar,
}: {
  codigo: number;
  nombreSugerido: string;
  vigenteDesdePorDefecto: string;
  posicionActual: number;
  total: number;
  onGuardado: (empleado: Empleado) => void;
  onOmitir: () => void;
  onCerrar: () => void;
}) {
  const [nombre, setNombre] = useState(nombreSugerido);
  const [posicion, setPosicion] = useState('');
  const [montoMensual, setMontoMensual] = useState('');
  const [vigenteDesde, setVigenteDesde] = useState(vigenteDesdePorDefecto);
  const [error, setError] = useState<string | null>(null);

  const guardar = useMutation({
    mutationFn: () =>
      crearEmpleado({
        codigo,
        nombre: nombre.trim(),
        posicion: posicion.trim(),
        salarioInicial: { montoMensual, vigenteDesde },
      }),
    onSuccess: (empleado) => onGuardado(empleado),
    onError: (err) => setError(mensajeError(err, 'No se pudo guardar el empleado.')),
  });

  const montoValido = Number(montoMensual) > 0;
  const puedeGuardar = nombre.trim() !== '' && posicion.trim() !== '' && montoValido && vigenteDesde !== '';

  return (
    <div className="hx-overlay">
      <div className="hx-modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div className="hx-eyebrow">Empleado nuevo detectado{total > 1 ? ` · ${posicionActual} de ${total}` : ''}</div>
          <span onClick={onCerrar} style={{ cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>
          El código <span className="tnum">{codigo}</span> no existe en el sistema
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px', fontSize: 13.5, lineHeight: 1.55 }}>
          Se encontró en el Excel pero no está registrado. Completa su posición y salario para darlo de alta y
          continuar incluyéndolo en esta importación.
        </p>

        {error && (
          <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label className="hx-label">Nombre completo
            <input className="hx-in" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>
          <label className="hx-label">Posición
            <input className="hx-in" value={posicion} onChange={(e) => setPosicion(e.target.value)} placeholder="Ej. Operario" autoFocus />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <label className="hx-label">Salario mensual (RD$)
              <input className="hx-in tnum" value={montoMensual} onChange={(e) => setMontoMensual(e.target.value)} placeholder="27000.00" />
            </label>
            <label className="hx-label">Vigente desde
              <input className="hx-in" type="date" value={vigenteDesde} onChange={(e) => setVigenteDesde(e.target.value)} />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 24 }}>
          <button type="button" className="hx-btn hx-btn-secondary" onClick={onOmitir} disabled={guardar.isPending}>
            Omitir esta fila
          </button>
          <button
            type="button"
            className="hx-btn hx-btn-primary"
            disabled={!puedeGuardar || guardar.isPending}
            onClick={() => guardar.mutate()}
          >
            {guardar.isPending && <Spinner />}
            {guardar.isPending ? 'Guardando…' : 'Guardar y continuar'}
          </button>
        </div>
      </div>
    </div>
  );
}
