import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/PageHeader';
import { Spinner } from '../components/Spinner';
import { SkeletonTableRows } from '../components/Skeleton';
import { listarEmpleados } from '../api/empleados';
import { listarTurnos } from '../api/turnos';
import { mensajeError } from '../api/client';
import {
  actualizarAsignacionTurno,
  crearAsignacionTurno,
  eliminarAsignacionTurno,
  listarAsignacionesPorEmpleado,
} from '../api/asignaciones-turno';
import type { AsignacionTurno, Empleado } from '../types/api';
import { formatFechaDia } from '../utils/format';

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

const FORM_VACIO = {
  turnoId: '',
  fechaDesde: hoy(),
  fechaHasta: '',
  comentario: '',
};

export function AsignacionesTurnoPage() {
  const queryClient = useQueryClient();

  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const [empleado, setEmpleado] = useState<Empleado | null>(null);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: candidatos = [] } = useQuery({
    queryKey: ['empleados-buscar', query],
    queryFn: () => listarEmpleados({ search: query || undefined, activo: true }),
    enabled: focus,
  });
  const resultados = candidatos.slice(0, 6);

  const { data: turnos = [] } = useQuery({ queryKey: ['turnos'], queryFn: listarTurnos });
  const turnosPorId = useMemo(() => new Map(turnos.map((t) => [t.id, t])), [turnos]);

  const { data: asignaciones = [], isLoading: cargandoAsignaciones } = useQuery({
    queryKey: ['asignaciones-turno', empleado?.id],
    queryFn: () => listarAsignacionesPorEmpleado(empleado!.id),
    enabled: !!empleado,
  });
  const ordenadas = [...asignaciones].sort((a, b) => b.fechaDesde.localeCompare(a.fechaDesde));

  function limpiarForm() {
    setMostrarForm(false);
    setForm(FORM_VACIO);
    setEditandoId(null);
    setError(null);
  }

  function seleccionarEmpleado(e: Empleado) {
    setEmpleado(e);
    setQuery(`${e.codigo} · ${e.nombre}`);
    setFocus(false);
    limpiarForm();
  }

  const guardar = useMutation({
    mutationFn: async () => {
      if (!empleado) throw new Error('Selecciona un empleado.');
      const datos = {
        turnoId: form.turnoId,
        fechaDesde: form.fechaDesde,
        fechaHasta: form.fechaHasta || undefined,
        comentario: form.comentario || undefined,
      };
      if (editandoId) {
        return actualizarAsignacionTurno(editandoId, datos);
      }
      return crearAsignacionTurno({ empleadoId: empleado.id, ...datos });
    },
    onSuccess: () => {
      limpiarForm();
      void queryClient.invalidateQueries({ queryKey: ['asignaciones-turno', empleado?.id] });
      void queryClient.invalidateQueries({ queryKey: ['registros'] });
      void queryClient.invalidateQueries({ queryKey: ['reporte-periodo'] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo guardar la asignación.')),
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => eliminarAsignacionTurno(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['asignaciones-turno', empleado?.id] });
      void queryClient.invalidateQueries({ queryKey: ['registros'] });
      void queryClient.invalidateQueries({ queryKey: ['reporte-periodo'] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo eliminar la asignación.')),
  });

  function editar(a: AsignacionTurno) {
    setEditandoId(a.id);
    setForm({
      turnoId: a.turnoId,
      fechaDesde: a.fechaDesde,
      fechaHasta: a.fechaHasta ?? '',
      comentario: a.comentario ?? '',
    });
    setMostrarForm(true);
    setError(null);
  }

  function confirmarEliminar(a: AsignacionTurno) {
    const turno = turnosPorId.get(a.turnoId);
    if (confirm(`¿Eliminar la asignación de turno ${turno?.nombre ?? ''} desde ${formatFechaDia(a.fechaDesde)}?`)) {
      eliminar.mutate(a.id);
    }
  }

  return (
    <div className="hx-page">
      <PageHeader eyebrow="Programación" title="Asignaciones de turno" />

      <div className="hx-card" style={{ padding: 24, marginBottom: 24, maxWidth: 560 }}>
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Empleado</label>
          <input
            className="hx-in"
            placeholder="Buscar por código o nombre…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setFocus(true); setEmpleado(null); }}
            onFocus={() => setFocus(true)}
          />
          {focus && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', zIndex: 5, maxHeight: 240, overflowY: 'auto' }}>
              {resultados.map((e) => (
                <div
                  key={e.id}
                  className="hx-navitem"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}
                  onClick={() => seleccionarEmpleado(e)}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--c-sea-50)', color: 'var(--brand-strong)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    {e.codigo}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{e.nombre}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{e.posicion}</div>
                  </div>
                </div>
              ))}
              {resultados.length === 0 && (
                <div style={{ padding: 14, fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center' }}>Sin resultados</div>
              )}
            </div>
          )}
        </div>
      </div>

      {!empleado && (
        <div className="hx-card hx-empty">Busca y selecciona un empleado para ver y administrar sus turnos asignados.</div>
      )}

      {empleado && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 17 }}>Turnos de {empleado.nombre}</h3>
            {!mostrarForm && (
              <button type="button" className="hx-btn hx-btn-secondary hx-btn-sm" onClick={() => setMostrarForm(true)}>
                + Nueva asignación
              </button>
            )}
          </div>

          {error && (
            <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 16, maxWidth: 720 }}>
              {error}
            </div>
          )}

          {mostrarForm && (
            <div className="hx-card" style={{ padding: 20, marginBottom: 20, maxWidth: 720, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <label className="hx-label">Turno
                <select className="hx-in" value={form.turnoId} onChange={(e) => setForm((f) => ({ ...f, turnoId: e.target.value }))}>
                  <option value="">Selecciona…</option>
                  {turnos.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre} ({t.horaInicio}–{t.horaFin})</option>
                  ))}
                </select>
              </label>
              <label className="hx-label">Desde
                <input className="hx-in" type="date" value={form.fechaDesde} onChange={(e) => setForm((f) => ({ ...f, fechaDesde: e.target.value }))} />
              </label>
              <label className="hx-label">Hasta (opcional)
                <input className="hx-in" type="date" value={form.fechaHasta} onChange={(e) => setForm((f) => ({ ...f, fechaHasta: e.target.value }))} />
              </label>
              <label className="hx-label" style={{ gridColumn: '1 / -1' }}>Comentario
                <input className="hx-in" placeholder="Ej: refuerzo por temporada alta" value={form.comentario} onChange={(e) => setForm((f) => ({ ...f, comentario: e.target.value }))} />
              </label>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="hx-btn hx-btn-secondary" onClick={limpiarForm}>Cancelar</button>
                <button type="button" className="hx-btn hx-btn-primary" disabled={!form.turnoId || guardar.isPending} onClick={() => guardar.mutate()}>
                  {guardar.isPending && <Spinner />}
                  {guardar.isPending ? 'Guardando…' : editandoId ? 'Actualizar asignación' : 'Guardar asignación'}
                </button>
              </div>
            </div>
          )}

          <div className="hx-table-wrap">
            <table className="hx-table">
              <thead>
                <tr>
                  <th className="hx-th">Turno</th>
                  <th className="hx-th">Desde</th>
                  <th className="hx-th">Hasta</th>
                  <th className="hx-th">Comentario</th>
                  <th className="hx-th" style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargandoAsignaciones && (
                  <SkeletonTableRows columns={5} rows={3} align={['left', 'left', 'left', 'left', 'right']} />
                )}
                {!cargandoAsignaciones && ordenadas.map((a) => {
                  const turno = turnosPorId.get(a.turnoId);
                  return (
                    <tr key={a.id} className="hx-row hx-row-in">
                      <td className="hx-td" style={{ fontWeight: 600 }}>{turno?.nombre ?? a.turnoId}</td>
                      <td className="hx-td tnum">{formatFechaDia(a.fechaDesde)}</td>
                      <td className="hx-td tnum">{a.fechaHasta ? formatFechaDia(a.fechaHasta) : <span className="hx-badge hx-badge-success">Indefinida</span>}</td>
                      <td className="hx-td" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{a.comentario ?? '—'}</td>
                      <td className="hx-td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span style={{ color: 'var(--brand-strong)', cursor: 'pointer', marginRight: 12, fontWeight: 600 }} onClick={() => editar(a)}>Editar</span>
                        <span style={{ color: 'var(--c-danger)', cursor: 'pointer', fontWeight: 600 }} onClick={() => confirmarEliminar(a)}>Eliminar</span>
                      </td>
                    </tr>
                  );
                })}
                {!cargandoAsignaciones && ordenadas.length === 0 && (
                  <tr><td className="hx-td" colSpan={5}><div className="hx-empty">Sin asignaciones registradas para este empleado.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
