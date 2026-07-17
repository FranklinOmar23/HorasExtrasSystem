import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { actualizarEmpleado, crearEmpleado, crearSalario, listarSalarios } from '../api/empleados';
import { mensajeError } from '../api/client';
import type { Empleado } from '../types/api';
import { formatFechaDia, formatMonto } from '../utils/format';

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

export function EmpleadoDrawer({ empleado, onClose }: { empleado: Empleado | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const esNuevo = empleado === null;

  const [codigo, setCodigo] = useState(empleado ? String(empleado.codigo) : '');
  const [cedula, setCedula] = useState(empleado?.cedula ?? '');
  const [nombre, setNombre] = useState(empleado?.nombre ?? '');
  const [posicion, setPosicion] = useState(empleado?.posicion ?? '');
  const [activo, setActivo] = useState(empleado?.activo ?? true);
  const [montoInicial, setMontoInicial] = useState('');
  const [vigenteInicial, setVigenteInicial] = useState(hoy());
  const [error, setError] = useState<string | null>(null);

  const [mostrarNuevoSalario, setMostrarNuevoSalario] = useState(false);
  const [montoNuevo, setMontoNuevo] = useState('');
  const [vigenteNuevo, setVigenteNuevo] = useState(hoy());

  const { data: salarios = [] } = useQuery({
    queryKey: ['salarios', empleado?.id],
    queryFn: () => listarSalarios(empleado!.id),
    enabled: !esNuevo,
  });

  const guardarEmpleado = useMutation({
    mutationFn: async () => {
      if (esNuevo) {
        return crearEmpleado({
          codigo: Number(codigo),
          nombre,
          cedula: cedula || undefined,
          posicion,
          salarioInicial: { montoMensual: montoInicial, vigenteDesde: vigenteInicial },
        });
      }
      return actualizarEmpleado(empleado.id, { nombre, cedula: cedula || undefined, posicion, activo });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['empleados'] });
      void queryClient.invalidateQueries({ queryKey: ['empleados-todos'] });
      onClose();
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo guardar el empleado.')),
  });

  const agregarSalario = useMutation({
    mutationFn: () => crearSalario(empleado!.id, { montoMensual: montoNuevo, vigenteDesde: vigenteNuevo }),
    onSuccess: () => {
      setMostrarNuevoSalario(false);
      setMontoNuevo('');
      void queryClient.invalidateQueries({ queryKey: ['salarios', empleado?.id] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo registrar el nuevo salario.')),
  });

  return (
    <div className="hx-drawer-overlay" onClick={onClose}>
      <div className="hx-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="hx-drawer-head">
          <div>
            <div className="hx-eyebrow">{esNuevo ? 'Nuevo registro' : `Empleado · ${empleado.codigo}`}</div>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>{esNuevo ? 'Nuevo empleado' : 'Editar empleado'}</h2>
          </div>
          <span onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 6 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </div>
        <div className="hx-drawer-body">
          {error && (
            <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <label className="hx-label">Código
              <input className="hx-in" value={codigo} disabled={!esNuevo} onChange={(e) => setCodigo(e.target.value)} />
            </label>
            <label className="hx-label">Cédula
              <input className="hx-in" value={cedula} onChange={(e) => setCedula(e.target.value)} />
            </label>
          </div>
          <label className="hx-label">Nombre completo
            <input className="hx-in" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>
          <label className="hx-label">Posición
            <input className="hx-in" value={posicion} onChange={(e) => setPosicion(e.target.value)} />
          </label>

          {esNuevo ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <label className="hx-label">Salario mensual (RD$)
                <input className="hx-in tnum" value={montoInicial} onChange={(e) => setMontoInicial(e.target.value)} placeholder="27000.00" />
              </label>
              <label className="hx-label">Vigente desde
                <input className="hx-in" type="date" value={vigenteInicial} onChange={(e) => setVigenteInicial(e.target.value)} />
              </label>
            </div>
          ) : (
            <label className="hx-label" style={{ maxWidth: 220 }}>Estado
              <select className="hx-in" value={activo ? 'activo' : 'inactivo'} onChange={(e) => setActivo(e.target.value === 'activo')}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>
          )}

          {!esNuevo && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 15 }}>Historial de salarios</h3>
                <span style={{ color: 'var(--brand-strong)', cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }} onClick={() => setMostrarNuevoSalario((v) => !v)}>
                  + Agregar
                </span>
              </div>
              {mostrarNuevoSalario && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input className="hx-in tnum" placeholder="Monto mensual" value={montoNuevo} onChange={(e) => setMontoNuevo(e.target.value)} />
                  <input className="hx-in" type="date" value={vigenteNuevo} onChange={(e) => setVigenteNuevo(e.target.value)} style={{ maxWidth: 160 }} />
                  <button type="button" className="hx-btn hx-btn-primary hx-btn-sm" disabled={agregarSalario.isPending} onClick={() => agregarSalario.mutate()}>
                    OK
                  </button>
                </div>
              )}
              <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                {salarios.map((s) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderBottom: '1px solid var(--border)', background: s.vigenteHasta === null ? 'var(--c-sea-50)' : undefined }}>
                    <div>
                      <div className="tnum" style={{ fontSize: 14, fontWeight: s.vigenteHasta === null ? 700 : 600 }}>{formatMonto(s.montoMensual)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        {s.vigenteHasta === null
                          ? `Vigente desde ${formatFechaDia(s.vigenteDesde)}`
                          : `${formatFechaDia(s.vigenteDesde)} – ${formatFechaDia(s.vigenteHasta)}`}
                      </div>
                    </div>
                    {s.vigenteHasta === null && <span className="hx-badge hx-badge-success">Actual</span>}
                  </div>
                ))}
                {salarios.length === 0 && <div style={{ padding: 14, fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center' }}>Sin historial.</div>}
              </div>
            </div>
          )}
        </div>
        <div className="hx-drawer-foot">
          <button type="button" className="hx-btn hx-btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="button" className="hx-btn hx-btn-primary" disabled={guardarEmpleado.isPending} onClick={() => guardarEmpleado.mutate()}>
            {guardarEmpleado.isPending ? 'Guardando…' : 'Guardar empleado'}
          </button>
        </div>
      </div>
    </div>
  );
}
