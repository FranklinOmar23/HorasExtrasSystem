import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { PageHeader } from '../components/PageHeader';
import { SkeletonLine, SkeletonTableRows } from '../components/Skeleton';
import { Spinner } from '../components/Spinner';
import { useAuth } from '../auth/AuthContext';
import { usePeriodoActivo } from '../periodos/PeriodoContext';
import {
  crearPeriodo,
  eliminarPeriodo,
  eliminarPeriodoPermanentemente,
  listarPeriodosEliminados,
  restaurarPeriodo,
} from '../api/periodos';
import { mensajeError } from '../api/client';
import { obtenerReportePeriodo } from '../api/reportes';
import { diasDesde, formatMonto, formatRangoPeriodo } from '../utils/format';
import type { Periodo } from '../types/api';

const DIAS_LIMITE_RESTAURACION = 30;

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

function TotalPeriodo({ periodo }: { periodo: Periodo }) {
  const { data, isLoading } = useQuery({
    queryKey: ['reporte-periodo', periodo.id],
    queryFn: () => obtenerReportePeriodo(periodo.id),
  });
  if (isLoading) return <SkeletonLine width={80} align="right" style={{ marginLeft: 'auto' }} />;
  return <>{data ? formatMonto(data.granTotal) : '—'}</>;
}

const TEXTO_CONFIRMACION_BORRADO = 'ELIMINAR';

function PapeleraPeriodos({ onCerrar }: { onCerrar: () => void }) {
  const queryClient = useQueryClient();
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'ADMIN';
  const [error, setError] = useState<string | null>(null);
  const [periodoABorrar, setPeriodoABorrar] = useState<Periodo | null>(null);
  const [textoConfirmacion, setTextoConfirmacion] = useState('');

  const { data: eliminados = [], isLoading } = useQuery({
    queryKey: ['periodos-eliminados'],
    queryFn: listarPeriodosEliminados,
  });

  const restaurar = useMutation({
    mutationFn: (id: string) => restaurarPeriodo(id),
    onSuccess: () => {
      setError(null);
      void queryClient.invalidateQueries({ queryKey: ['periodos-eliminados'] });
      void queryClient.invalidateQueries({ queryKey: ['periodos'] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo restaurar el periodo.')),
  });

  const eliminarPermanente = useMutation({
    mutationFn: (id: string) => eliminarPeriodoPermanentemente(id),
    onSuccess: () => {
      setError(null);
      setPeriodoABorrar(null);
      setTextoConfirmacion('');
      void queryClient.invalidateQueries({ queryKey: ['periodos-eliminados'] });
      void queryClient.invalidateQueries({ queryKey: ['periodos'] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo eliminar permanentemente el periodo.')),
  });

  const ordenados = [...eliminados].sort((a, b) => (b.eliminadoEn ?? '').localeCompare(a.eliminadoEn ?? ''));

  return (
    <div className="hx-card hx-fade-in" style={{ padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 15 }}>Periodos eliminados</h3>
        <span onClick={onCerrar} style={{ cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 13 }}>Cerrar ✕</span>
      </div>
      {error && (
        <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 14 }}>
          {error}
        </div>
      )}
      {isLoading && <SkeletonLine width="60%" />}
      {!isLoading && ordenados.length === 0 && (
        <div className="hx-empty">No hay periodos eliminados.</div>
      )}
      {!isLoading && ordenados.map((p) => {
        const diasTranscurridos = p.eliminadoEn ? diasDesde(p.eliminadoEn) : 0;
        const diasRestantes = DIAS_LIMITE_RESTAURACION - diasTranscurridos;
        const expirado = diasRestantes <= 0;
        return (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{formatRangoPeriodo(p.fechaInicio, p.fechaFin)}</div>
              <div style={{ fontSize: 12, color: expirado ? 'var(--c-danger)' : 'var(--text-secondary)' }}>
                {expirado ? 'Plazo de restauración vencido' : `${diasRestantes} día${diasRestantes === 1 ? '' : 's'} restantes para restaurar`}
              </div>
            </div>
            {esAdmin && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {!expirado && (
                  restaurar.isPending && restaurar.variables === p.id ? (
                    <Spinner />
                  ) : (
                    <button type="button" className="hx-btn hx-btn-secondary hx-btn-sm" onClick={() => restaurar.mutate(p.id)}>
                      Restaurar
                    </button>
                  )
                )}
                {eliminarPermanente.isPending && eliminarPermanente.variables === p.id ? (
                  <Spinner />
                ) : (
                  <span
                    onClick={() => { setPeriodoABorrar(p); setTextoConfirmacion(''); setError(null); }}
                    style={{ color: 'var(--c-danger)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                  >
                    Eliminar permanentemente
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}

      {periodoABorrar && (
        <div className="hx-overlay" onClick={() => setPeriodoABorrar(null)}>
          <div className="hx-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--c-danger-bg)', color: 'var(--c-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: 22 }}>
              ¿Eliminar permanentemente {formatRangoPeriodo(periodoABorrar.fechaInicio, periodoABorrar.fechaFin)}?
            </h2>
            <div style={{ background: 'var(--c-danger-bg)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--c-danger)', marginBottom: 18, fontWeight: 500 }}>
              ⚠ Esto borra para siempre el periodo y todos sus registros, cálculos e importaciones. No se puede deshacer — no hay papelera después de esto.
            </div>
            <label className="hx-label" style={{ marginBottom: 18 }}>
              Escribe <strong className="tnum">{TEXTO_CONFIRMACION_BORRADO}</strong> para confirmar
              <input
                className="hx-in"
                value={textoConfirmacion}
                onChange={(e) => setTextoConfirmacion(e.target.value)}
                autoFocus
              />
            </label>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" className="hx-btn hx-btn-secondary" onClick={() => setPeriodoABorrar(null)}>Cancelar</button>
              <button
                type="button"
                className="hx-btn"
                style={{ background: 'var(--c-danger)', color: 'var(--text-on-brand)' }}
                disabled={textoConfirmacion !== TEXTO_CONFIRMACION_BORRADO || eliminarPermanente.isPending}
                onClick={() => eliminarPermanente.mutate(periodoABorrar.id)}
              >
                {eliminarPermanente.isPending && <Spinner />}
                {eliminarPermanente.isPending ? 'Eliminando…' : 'Sí, eliminar para siempre'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PeriodosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'ADMIN';
  const { periodos, seleccionarPeriodo, cargando } = usePeriodoActivo();

  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarPapelera, setMostrarPapelera] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(hoy());
  const [fechaFin, setFechaFin] = useState(hoy());
  const [error, setError] = useState<string | null>(null);

  const crear = useMutation({
    mutationFn: () => crearPeriodo({ fechaInicio, fechaFin }),
    onSuccess: () => {
      setMostrarForm(false);
      void queryClient.invalidateQueries({ queryKey: ['periodos'] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo crear el periodo.')),
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => eliminarPeriodo(id),
    onSuccess: () => {
      setError(null);
      void queryClient.invalidateQueries({ queryKey: ['periodos'] });
      void queryClient.invalidateQueries({ queryKey: ['periodos-eliminados'] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo eliminar el periodo.')),
  });

  const ordenados = [...periodos].sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio));

  function verReporte(p: Periodo) {
    seleccionarPeriodo(p.id);
    navigate('/reporte');
  }

  function confirmarEliminar(p: Periodo) {
    const rango = formatRangoPeriodo(p.fechaInicio, p.fechaFin);
    if (confirm(`¿Eliminar el periodo ${rango}? Podrás restaurarlo dentro de los próximos ${DIAS_LIMITE_RESTAURACION} días desde la papelera.`)) {
      eliminar.mutate(p.id);
    }
  }

  return (
    <div className="hx-page">
      <PageHeader
        eyebrow="Historial"
        title="Periodos"
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="hx-btn hx-btn-secondary hx-btn-sm" onClick={() => setMostrarPapelera((v) => !v)}>
              {mostrarPapelera ? 'Ocultar papelera' : 'Ver papelera'}
            </button>
            <button type="button" className="hx-btn hx-btn-primary hx-btn-sm" onClick={() => setMostrarForm((v) => !v)}>
              + Nuevo periodo
            </button>
          </div>
        }
      />

      {mostrarPapelera && <PapeleraPeriodos onCerrar={() => setMostrarPapelera(false)} />}

      {mostrarForm && (
        <div className="hx-card" style={{ padding: 20, marginBottom: 20, maxWidth: 520, display: 'flex', gap: 14, alignItems: 'flex-end' }}>
          <label className="hx-label" style={{ flex: 1 }}>Fecha inicio
            <input className="hx-in" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </label>
          <label className="hx-label" style={{ flex: 1 }}>Fecha fin
            <input className="hx-in" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </label>
          <button type="button" className="hx-btn hx-btn-primary" disabled={crear.isPending} onClick={() => crear.mutate()}>
            {crear.isPending && <Spinner />}
            {crear.isPending ? 'Creando…' : 'Crear'}
          </button>
        </div>
      )}
      {error && (
        <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 16, maxWidth: 520 }}>
          {error}
        </div>
      )}

      <div className="hx-table-wrap">
        <table className="hx-table">
          <thead>
            <tr>
              <th className="hx-th">Periodo</th>
              <th className="hx-th">Estado</th>
              <th className="hx-th" style={{ textAlign: 'right' }}>Total pagado</th>
              <th className="hx-th">Fecha de cierre</th>
              <th className="hx-th" style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <SkeletonTableRows columns={5} rows={5} align={['left', 'left', 'right', 'left', 'right']} />
            )}
            {!cargando && ordenados.map((p) => (
              <tr key={p.id} className="hx-row hx-row-in">
                <td className="hx-td" style={{ fontWeight: 600 }}>{formatRangoPeriodo(p.fechaInicio, p.fechaFin)}</td>
                <td className="hx-td">
                  <Badge tono={p.estado === 'ABIERTO' ? 'success' : 'neutral'} dot>{p.estado === 'ABIERTO' ? 'Abierto' : 'Cerrado'}</Badge>
                </td>
                <td className="hx-td tnum" style={{ textAlign: 'right', fontWeight: 700 }}><TotalPeriodo periodo={p} /></td>
                <td className="hx-td tnum" style={{ color: 'var(--text-secondary)' }}>
                  {p.cerradoEn ? new Date(p.cerradoEn).toLocaleDateString('es-DO') : '—'}
                </td>
                <td className="hx-td" style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <span onClick={() => verReporte(p)} style={{ color: 'var(--brand-strong)', cursor: 'pointer', fontWeight: 600 }}>Ver</span>
                    {esAdmin && p.estado === 'ABIERTO' && (
                      eliminar.isPending && eliminar.variables === p.id ? (
                        <Spinner />
                      ) : (
                        <span
                          onClick={() => confirmarEliminar(p)}
                          style={{ color: 'var(--c-danger)', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Eliminar
                        </span>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!cargando && ordenados.length === 0 && (
              <tr><td className="hx-td" colSpan={5}><div className="hx-empty">Sin periodos todavía.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
