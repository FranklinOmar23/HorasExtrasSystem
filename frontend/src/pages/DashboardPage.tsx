import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { PageHeader } from '../components/PageHeader';
import { SkeletonCircle, SkeletonLine } from '../components/Skeleton';
import { usePeriodoActivo } from '../periodos/PeriodoContext';
import { obtenerHistorico, obtenerReportePeriodo } from '../api/reportes';
import type { HistoricoPeriodo } from '../types/api';
import { formatMonto, formatNumero, formatRangoPeriodo } from '../utils/format';

function sumaHoras(horas: { he35: string; he100: string; nocturna: string; feriado: string }): number {
  return Number(horas.he35) + Number(horas.he100) + Number(horas.nocturna) + Number(horas.feriado);
}

/** Redondea hacia arriba a un número "agradable" (1/2/2.5/5/10 × 10^n) para usar como techo del eje Y. */
function techoAgradable(valor: number): number {
  if (valor <= 0) return 1;
  const magnitud = 10 ** Math.floor(Math.log10(valor));
  for (const paso of [1, 2, 2.5, 5, 10]) {
    const techo = paso * magnitud;
    if (techo >= valor) return techo;
  }
  return 10 * magnitud;
}

function formatCompacto(valor: number): string {
  if (valor === 0) return '0';
  return `${(valor / 1000).toFixed(valor % 1000 === 0 ? 0 : 1)}k`;
}

function GranTotalChart({ historico, periodoActivoId }: { historico: HistoricoPeriodo[]; periodoActivoId: string | null }) {
  const maxHistorico = Math.max(1, ...historico.map((h) => Number(h.granTotal)));
  const techo = techoAgradable(maxHistorico);
  const marcasEje = [1, 0.75, 0.5, 0.25, 0].map((f) => techo * f);

  return (
    <div className="hx-fade-in" style={{ display: 'flex', gap: 10, height: 220 }}>
      {/* eje Y */}
      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 28 }}>
        {marcasEje.map((m) => (
          <div key={m} className="tnum" style={{ fontSize: 10.5, color: 'var(--text-tertiary)', lineHeight: 1 }}>
            {formatCompacto(m)}
          </div>
        ))}
      </div>

      {/* area de ploteo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {marcasEje.map((m) => (
              <div key={m} style={{ borderTop: '1px solid var(--border)' }} />
            ))}
          </div>
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 12 }}>
            {historico.map((h) => {
              const esActivo = h.periodo.id === periodoActivoId;
              const alturaPct = Math.max(2, (Number(h.granTotal) / techo) * 100);
              return (
                <div
                  key={h.periodo.id}
                  className="hx-hist-slot"
                  tabIndex={0}
                  role="img"
                  aria-label={`${formatRangoPeriodo(h.periodo.fechaInicio, h.periodo.fechaFin)}: ${formatMonto(h.granTotal)}`}
                  style={{ position: 'relative', flex: '1 1 0', maxWidth: 56, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                >
                  <div className="hx-hist-tooltip">
                    <div className="tnum" style={{ fontWeight: 700 }}>{formatMonto(h.granTotal)}</div>
                    <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 11, marginTop: 1 }}>
                      {formatRangoPeriodo(h.periodo.fechaInicio, h.periodo.fechaFin)}
                    </div>
                  </div>
                  <div
                    className="hx-hist-bar"
                    style={{
                      width: '100%',
                      maxWidth: 24,
                      height: `${alturaPct}%`,
                      background: esActivo ? 'var(--accent)' : 'var(--c-sea-200)',
                      borderRadius: '4px 4px 0 0',
                      boxShadow: esActivo ? 'var(--shadow-accent)' : 'none',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* etiquetas de periodo */}
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: 12, marginTop: 8, height: 20 }}>
          {historico.map((h) => {
            const esActivo = h.periodo.id === periodoActivoId;
            return (
              <div
                key={h.periodo.id}
                style={{
                  flex: '1 1 0', maxWidth: 56, textAlign: 'center', fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: esActivo ? 'var(--text)' : 'var(--text-tertiary)', fontWeight: esActivo ? 600 : 400,
                }}
              >
                {formatRangoPeriodo(h.periodo.fechaInicio, h.periodo.fechaFin).split(' ').slice(-2).join(' ')}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
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

  const { data: historico = [], isLoading: cargandoHistorico } = useQuery({
    queryKey: ['historico', 6],
    queryFn: () => obtenerHistorico(6),
  });

  if (cargandoPeriodos) {
    return (
      <div className="hx-page">
        <div className="hx-page-head" style={{ marginBottom: 24 }}>
          <div>
            <SkeletonLine width={110} height={11} style={{ marginBottom: 10 }} />
            <SkeletonLine width={200} height={28} />
          </div>
        </div>
        <div className="hx-kpi-grid">
          <div className="hx-kpi-hero"><SkeletonLine width={140} height={11} style={{ marginBottom: 16, background: 'rgba(255,255,255,.12)' }} /><SkeletonLine width={180} height={30} style={{ background: 'rgba(255,255,255,.16)' }} /></div>
          {[0, 1, 2].map((i) => (
            <div className="hx-kpi" key={i}>
              <SkeletonLine width={90} height={11} style={{ marginBottom: 14 }} />
              <SkeletonLine width={60} height={26} />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
          <div className="hx-card" style={{ padding: '22px 24px' }}><SkeletonLine width={160} height={18} style={{ marginBottom: 20 }} /><SkeletonLine width="100%" height={180} /></div>
          <div className="hx-card" style={{ padding: '22px 24px' }}><SkeletonLine width={140} height={18} style={{ marginBottom: 20 }} /><SkeletonLine width="100%" height={180} /></div>
        </div>
      </div>
    );
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
              {cargandoReporte ? (
                <SkeletonLine width={170} height={30} style={{ background: 'rgba(255,255,255,.16)' }} />
              ) : (
                formatMonto(reporte?.granTotal ?? '0')
              )}
            </div>
          </div>
        </div>
        <div className="hx-kpi">
          <div className="hx-kpi-label">Total horas extras</div>
          <div className="tnum hx-kpi-value">{cargandoReporte ? <SkeletonLine width={70} height={26} /> : formatNumero(totalHoras)}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10 }}>horas en el periodo</div>
        </div>
        <div className="hx-kpi">
          <div className="hx-kpi-label">Empleados con horas</div>
          <div className="tnum hx-kpi-value">{cargandoReporte ? <SkeletonLine width={40} height={26} /> : filas.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10 }}>con al menos un registro</div>
        </div>
        <div className="hx-kpi">
          <div className="hx-kpi-label">Registros del periodo</div>
          <div className="tnum hx-kpi-value">{cargandoReporte ? <SkeletonLine width={40} height={26} /> : filas.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10 }}>empleados con desglose</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <div className="hx-card" style={{ padding: '22px 24px' }}>
          <div style={{ marginBottom: 22 }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>Gran total por quincena</h3>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Últimos periodos · RD$</div>
          </div>
          {cargandoHistorico ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 12, height: 220, paddingLeft: 30 }}>
              {[62, 88, 40, 100, 55, 74].map((h, i) => (
                <div key={i} style={{ flex: '1 1 0', maxWidth: 56, height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: 28 }}>
                  <span className="hx-skel hx-skel-block" style={{ width: '100%', maxWidth: 24, height: `${h}%`, margin: '0 auto', borderRadius: '4px 4px 0 0' }} />
                </div>
              ))}
            </div>
          ) : historico.length === 0 ? (
            <div className="hx-empty">Sin datos históricos todavía.</div>
          ) : (
            <GranTotalChart historico={historico} periodoActivoId={periodoActivoId} />
          )}
        </div>

        <div className="hx-card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>Top 5 con más horas</h3>
            <a onClick={() => navigate('/reporte')} style={{ fontSize: 12, color: 'var(--brand-strong)', cursor: 'pointer', fontWeight: 600 }}>
              Ver reporte →
            </a>
          </div>
          {cargandoReporte ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <SkeletonCircle size={26} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <SkeletonLine width="70%" height={13} style={{ marginBottom: 6 }} />
                    <SkeletonLine width="35%" height={10} />
                  </div>
                  <SkeletonLine width={34} height={13} />
                </div>
              ))}
            </div>
          ) : top5.length === 0 ? (
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
