import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { PageHeader } from '../components/PageHeader';
import { SkeletonLine, SkeletonTableRows } from '../components/Skeleton';
import { Spinner } from '../components/Spinner';
import { usePeriodoActivo } from '../periodos/PeriodoContext';
import { crearPeriodo } from '../api/periodos';
import { mensajeError } from '../api/client';
import { obtenerReportePeriodo } from '../api/reportes';
import { formatMonto, formatRangoPeriodo } from '../utils/format';
import type { Periodo } from '../types/api';

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

export function PeriodosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { periodos, seleccionarPeriodo, cargando } = usePeriodoActivo();

  const [mostrarForm, setMostrarForm] = useState(false);
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

  const ordenados = [...periodos].sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio));

  function verReporte(p: Periodo) {
    seleccionarPeriodo(p.id);
    navigate('/reporte');
  }

  return (
    <div className="hx-page">
      <PageHeader
        eyebrow="Historial"
        title="Periodos"
        actions={
          <button type="button" className="hx-btn hx-btn-primary hx-btn-sm" onClick={() => setMostrarForm((v) => !v)}>
            + Nuevo periodo
          </button>
        }
      />

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
                  <span onClick={() => verReporte(p)} style={{ color: 'var(--brand-strong)', cursor: 'pointer', fontWeight: 600 }}>Ver</span>
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
