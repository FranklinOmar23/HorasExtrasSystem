import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { PageHeader } from '../components/PageHeader';
import { usePeriodoActivo } from '../periodos/PeriodoContext';
import { obtenerHistorico, obtenerReportePeriodo } from '../api/reportes';
import { formatMonto, formatNumero, formatRangoPeriodo } from '../utils/format';

function sumaHoras(horas: { he35: string; he100: string; nocturna: string; feriado: string }): number {
  return Number(horas.he35) + Number(horas.he100) + Number(horas.nocturna) + Number(horas.feriado);
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { periodos, periodoActivo, periodoActivoId, seleccionarPeriodo, cargando: cargandoPeriodos } =
    usePeriodoActivo();

  const { data: reporte, isLoading: cargandoReporte } = useQuery({
    queryKey: ['reporte-periodo', periodoActivoId],
    queryFn: () => obtenerReportePeriodo(periodoActivoId as string),
    enabled: !!periodoActivoId,
  });

  const { data: historico = [] } = useQuery({
    queryKey: ['historico', 6],
    queryFn: () => obtenerHistorico(6),
  });

  if (cargandoPeriodos) {
    return <div className="hx-page hx-empty">Cargando…</div>;
  }

  if (!periodoActivo) {
    return (
      <div className="hx-page">
        <PageHeader eyebrow="Panel general" title="Dashboard" />
        <div className="hx-card hx-empty">
          Todavía no hay periodos creados. Ve a <a href="/periodos">Periodos</a> para crear el primero.
        </div>
      </div>
    );
  }

  const filas = reporte?.filas ?? [];
  const totalHoras = filas.reduce((acc, f) => acc + sumaHoras(f.horas), 0);
  const top5 = [...filas]
    .sort((a, b) => sumaHoras(b.horas) - sumaHoras(a.horas))
    .slice(0, 5);

  const maxHistorico = Math.max(1, ...historico.map((h) => Number(h.granTotal)));

  return (
    <div className="hx-page">
      <PageHeader
        eyebrow="Panel general"
        title="Dashboard"
        actions={
          <>
            <select
              className="hx-in"
              style={{ width: 'auto', minWidth: 200, fontWeight: 600 }}
              value={periodoActivoId ?? ''}
              onChange={(e) => seleccionarPeriodo(e.target.value)}
            >
              {periodos.map((p) => (
                <option key={p.id} value={p.id}>
                  {formatRangoPeriodo(p.fechaInicio, p.fechaFin)}
                </option>
              ))}
            </select>
            <Badge tono={periodoActivo.estado === 'ABIERTO' ? 'success' : 'neutral'} dot>
              {periodoActivo.estado === 'ABIERTO' ? 'Abierto' : 'Cerrado'}
            </Badge>
          </>
        }
      />

      <div className="hx-kpi-grid">
        <div className="hx-kpi-hero">
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>
              Total a pagar · periodo {periodoActivo.estado === 'ABIERTO' ? 'activo' : 'seleccionado'}
            </div>
            <div className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(26px,3.4vw,40px)', lineHeight: 1, letterSpacing: '-.02em', marginTop: 14, whiteSpace: 'nowrap' }}>
              {cargandoReporte ? '—' : formatMonto(reporte?.granTotal ?? '0')}
            </div>
          </div>
        </div>
        <div className="hx-kpi">
          <div className="hx-kpi-label">Total horas extras</div>
          <div className="tnum hx-kpi-value">{formatNumero(totalHoras)}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10 }}>horas en el periodo</div>
        </div>
        <div className="hx-kpi">
          <div className="hx-kpi-label">Empleados con horas</div>
          <div className="tnum hx-kpi-value">{filas.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10 }}>con al menos un registro</div>
        </div>
        <div className="hx-kpi">
          <div className="hx-kpi-label">Registros del periodo</div>
          <div className="tnum hx-kpi-value">{filas.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10 }}>empleados con desglose</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <div className="hx-card" style={{ padding: '22px 24px' }}>
          <div style={{ marginBottom: 22 }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>Gran total por quincena</h3>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Últimos periodos · RD$</div>
          </div>
          {historico.length === 0 ? (
            <div className="hx-empty">Sin datos históricos todavía.</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18, height: 200, paddingTop: 10 }}>
              {historico.map((h) => {
                const esActivo = h.periodo.id === periodoActivoId;
                const alturaPct = Math.max(4, (Number(h.granTotal) / maxHistorico) * 100);
                return (
                  <div key={h.periodo.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, height: '100%', justifyContent: 'flex-end' }}>
                    <div className="tnum" style={{ fontSize: 11, color: esActivo ? 'var(--accent-strong)' : 'var(--text-secondary)', fontWeight: esActivo ? 700 : 400 }}>
                      {(Number(h.granTotal) / 1000).toFixed(1)}k
                    </div>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 46,
                        height: `${alturaPct}%`,
                        background: esActivo ? 'var(--accent)' : 'var(--c-sea-200)',
                        borderRadius: '8px 8px 0 0',
                        boxShadow: esActivo ? 'var(--shadow-accent)' : 'none',
                      }}
                    />
                    <div style={{ fontSize: 11, color: esActivo ? 'var(--text)' : 'var(--text-tertiary)', fontWeight: esActivo ? 600 : 400, fontFamily: 'var(--font-mono)' }}>
                      {formatRangoPeriodo(h.periodo.fechaInicio, h.periodo.fechaFin).split(' ').slice(-2).join(' ')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="hx-card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>Top 5 con más horas</h3>
            <a onClick={() => navigate('/reporte')} style={{ fontSize: 12, color: 'var(--brand-strong)', cursor: 'pointer', fontWeight: 600 }}>
              Ver reporte →
            </a>
          </div>
          {top5.length === 0 ? (
            <div className="hx-empty">Sin registros todavía en este periodo.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {top5.map((fila, i) => (
                <div key={fila.empleado.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--c-sea-50)', color: 'var(--brand-strong)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    {i + 1}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fila.empleado.nombre}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>Código {fila.empleado.codigo}</div>
                  </div>
                  <div style={{ textAlign: 'right', flex: 'none' }}>
                    <div className="tnum" style={{ fontSize: 14, fontWeight: 700 }}>{formatNumero(sumaHoras(fila.horas))}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>horas</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
