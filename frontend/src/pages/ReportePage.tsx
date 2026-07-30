import { Fragment, useState } from 'react';
import type { MouseEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '../components/Badge';
import { BotonExportarExcel } from '../components/BotonExportarExcel';
import { PageHeader } from '../components/PageHeader';
import { SkeletonLine, SkeletonTableRows } from '../components/Skeleton';
import { Spinner } from '../components/Spinner';
import { useDescargaArchivo } from '../hooks/useDescargaArchivo';
import { usePeriodoActivo } from '../periodos/PeriodoContext';
import { mensajeError } from '../api/client';
import { cerrarPeriodo } from '../api/periodos';
import { descargarReporteEmpleadoExcel, descargarReporteExcel, obtenerReporteEmpleado, obtenerReportePeriodo } from '../api/reportes';
import { etiquetaTipoHora, formatFechaCorta, formatMonto, formatNumero, formatRangoPeriodo } from '../utils/format';

const TONO_TURNO: Record<string, 'neutral' | 'sun' | 'sea' | 'coral'> = {
  DIURNO: 'neutral',
  SABADO: 'sea',
  NOCTURNO: 'sun',
};

function tonoTurno(codigo: string): 'neutral' | 'sun' | 'sea' | 'coral' {
  return TONO_TURNO[codigo] ?? 'coral';
}

function ExpandedRow({ periodoId, empleadoId }: { periodoId: string; empleadoId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['reporte-empleado', periodoId, empleadoId],
    queryFn: () => obtenerReporteEmpleado(periodoId, empleadoId),
  });
  const { descargando, progreso, exito, error: errorDescarga, ejecutar } = useDescargaArchivo();

  function exportarExcelEmpleado(e: MouseEvent) {
    e.stopPropagation();
    void ejecutar(
      (onProgreso) => descargarReporteEmpleadoExcel(periodoId, empleadoId, onProgreso),
      'No se pudo descargar el reporte de este empleado.',
    );
  }

  return (
    <tr>
      <td className="hx-td" colSpan={13} style={{ padding: 0, background: 'var(--c-paper-2)' }}>
        <div style={{ padding: '14px 20px 18px 52px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
              Detalle día por día
            </div>
            <BotonExportarExcel
              onClick={exportarExcelEmpleado}
              descargando={descargando}
              progreso={progreso}
              exito={exito}
              disabled={!data || data.dias.length === 0}
            />
          </div>
          {errorDescarga && (
            <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '8px 12px', fontSize: 12.5, fontWeight: 500, marginBottom: 10 }}>
              {errorDescarga}
            </div>
          )}
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 480 }}>
              <SkeletonLine width="90%" height={13} />
              <SkeletonLine width="75%" height={13} />
              <SkeletonLine width="82%" height={13} />
            </div>
          ) : !data || data.dias.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Sin registros en este periodo.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th className="hx-th" style={{ background: 'var(--surface)' }}>Fecha</th>
                  <th className="hx-th" style={{ background: 'var(--surface)' }}>Entrada</th>
                  <th className="hx-th" style={{ background: 'var(--surface)' }}>Salida</th>
                  <th className="hx-th" style={{ background: 'var(--surface)' }}>Turno</th>
                  <th className="hx-th" style={{ background: 'var(--surface)' }}>Tipo</th>
                  <th className="hx-th" style={{ background: 'var(--surface)', textAlign: 'right' }}>Horas</th>
                  <th className="hx-th" style={{ background: 'var(--surface)', textAlign: 'right' }}>Valor RD$</th>
                </tr>
              </thead>
              <tbody>
                {data.dias.map((d, i) => (
                  d.calculos.length === 0 ? (
                    <tr key={i}>
                      <td className="hx-td tnum">
                        {formatFechaCorta(d.fecha)}
                        {d.esRetroactivo && <span className="hx-badge hx-badge-sun" style={{ marginLeft: 6 }}>Retroactivo</span>}
                      </td>
                      <td className="hx-td tnum">{d.horaEntrada}</td>
                      <td className="hx-td tnum">{d.horaSalida}</td>
                      <td className="hx-td"><span className={`hx-badge hx-badge-${tonoTurno(d.turnoCodigo)}`}>{d.turnoNombre}</span></td>
                      <td className="hx-td"><span className="hx-badge hx-badge-neutral">Normal</span></td>
                      <td className="hx-td tnum" style={{ textAlign: 'right' }}>—</td>
                      <td className="hx-td tnum" style={{ textAlign: 'right', fontWeight: 600 }}>—</td>
                    </tr>
                  ) : d.calculos.map((c, j) => {
                    const et = etiquetaTipoHora(c.tipoHoraCodigo);
                    return (
                      <tr key={`${i}-${j}`}>
                        {j === 0 && (
                          <>
                            <td className="hx-td tnum" rowSpan={d.calculos.length}>
                              {formatFechaCorta(d.fecha)}
                              {d.esRetroactivo && <span className="hx-badge hx-badge-sun" style={{ marginLeft: 6 }}>Retroactivo</span>}
                            </td>
                            <td className="hx-td tnum" rowSpan={d.calculos.length}>{d.horaEntrada}</td>
                            <td className="hx-td tnum" rowSpan={d.calculos.length}>{d.horaSalida}</td>
                            <td className="hx-td" rowSpan={d.calculos.length}>
                              <span className={`hx-badge hx-badge-${tonoTurno(d.turnoCodigo)}`}>{d.turnoNombre}</span>
                            </td>
                          </>
                        )}
                        <td className="hx-td"><span className={`hx-badge hx-badge-${et.tono}`}>{et.texto}</span></td>
                        <td className="hx-td tnum" style={{ textAlign: 'right' }}>{formatNumero(c.cantidadHoras)}</td>
                        <td className="hx-td tnum" style={{ textAlign: 'right', fontWeight: 600 }}>{formatMonto(c.monto)}</td>
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
          )}
        </div>
      </td>
    </tr>
  );
}

export function ReportePage() {
  const queryClient = useQueryClient();
  const { periodoActivo, periodoActivoId, cargando: cargandoPeriodos } = usePeriodoActivo();
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});
  const [modalCerrar, setModalCerrar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const { descargando, progreso, exito, error: errorDescarga, ejecutar: ejecutarDescarga } = useDescargaArchivo();

  const { data: reporte, isLoading } = useQuery({
    queryKey: ['reporte-periodo', periodoActivoId],
    queryFn: () => obtenerReportePeriodo(periodoActivoId as string),
    enabled: !!periodoActivoId,
  });

  const cerrar = useMutation({
    mutationFn: () => cerrarPeriodo(periodoActivoId as string),
    onSuccess: () => {
      setModalCerrar(false);
      void queryClient.invalidateQueries({ queryKey: ['periodos'] });
      void queryClient.invalidateQueries({ queryKey: ['reporte-periodo', periodoActivoId] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo cerrar el periodo.')),
  });

  function exportarExcel() {
    if (!periodoActivoId) return;
    void ejecutarDescarga(
      (onProgreso) => descargarReporteExcel(periodoActivoId, onProgreso),
      'No se pudo descargar el reporte.',
    );
  }

  if (cargandoPeriodos) {
    return (
      <div className="hx-page">
        <PageHeader eyebrow="Cálculo de pago" title="Reporte del periodo" />
        <SkeletonLine width={280} height={38} style={{ marginBottom: 16 }} />
        <div className="hx-table-wrap" style={{ padding: 16 }}>
          <SkeletonLine width="100%" height={280} />
        </div>
      </div>
    );
  }

  if (!periodoActivo) {
    return (
      <div className="hx-page">
        <PageHeader eyebrow="Cálculo de pago" title="Reporte del periodo" />
        <div className="hx-card hx-empty">No hay ningún periodo disponible.</div>
      </div>
    );
  }

  const todasLasFilas = reporte?.filas ?? [];
  const queryNormalizada = query.trim().toLowerCase();
  const filas = queryNormalizada
    ? todasLasFilas.filter(
        (f) =>
          f.empleado.nombre.toLowerCase().includes(queryNormalizada) ||
          String(f.empleado.codigo).includes(queryNormalizada),
      )
    : todasLasFilas;
  const filtrando = queryNormalizada !== '';
  const totales = filas.reduce(
    (acc, f) => ({
      he35: acc.he35 + Number(f.horas.he35), he100: acc.he100 + Number(f.horas.he100),
      nocturna: acc.nocturna + Number(f.horas.nocturna), feriado: acc.feriado + Number(f.horas.feriado),
      v35: acc.v35 + Number(f.montos.he35), v100: acc.v100 + Number(f.montos.he100),
      vNocturna: acc.vNocturna + Number(f.montos.nocturna), vFeriado: acc.vFeriado + Number(f.montos.feriado),
    }),
    { he35: 0, he100: 0, nocturna: 0, feriado: 0, v35: 0, v100: 0, vNocturna: 0, vFeriado: 0 },
  );

  return (
    <div className="hx-page">
      <PageHeader
        eyebrow="Cálculo de pago"
        title="Reporte del periodo"
        extra={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {formatRangoPeriodo(periodoActivo.fechaInicio, periodoActivo.fechaFin)}
            </span>
            <Badge tono={periodoActivo.estado === 'ABIERTO' ? 'success' : 'neutral'} dot>
              {periodoActivo.estado === 'ABIERTO' ? 'Abierto' : 'Cerrado'}
            </Badge>
          </div>
        }
        actions={
          <>
            <BotonExportarExcel
              onClick={exportarExcel}
              descargando={descargando}
              progreso={progreso}
              exito={exito}
            />
            {periodoActivo.estado === 'ABIERTO' && (
              <button type="button" className="hx-btn hx-btn-accent hx-btn-sm" onClick={() => setModalCerrar(true)}>
                Cerrar periodo
              </button>
            )}
          </>
        }
      />

      {(error || errorDescarga) && (
        <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          {error || errorDescarga}
        </div>
      )}

      <div style={{ position: 'relative', maxWidth: 360, marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          className="hx-in"
          style={{ paddingLeft: 38 }}
          placeholder="Buscar por código o nombre…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="hx-table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="hx-table" style={{ minWidth: 1080 }}>
            <thead>
              <tr>
                <th className="hx-th" style={{ width: 28 }} />
                <th className="hx-th">Código</th>
                <th className="hx-th">Empleado</th>
                <th className="hx-th" style={{ textAlign: 'right' }}>Sal./hora</th>
                <th className="hx-th" style={{ textAlign: 'right' }}>H 35%</th>
                <th className="hx-th" style={{ textAlign: 'right' }}>H 100%</th>
                <th className="hx-th" style={{ textAlign: 'right' }}>H noct.</th>
                <th className="hx-th" style={{ textAlign: 'right' }}>H fer.</th>
                <th className="hx-th" style={{ textAlign: 'right' }}>Val. 35%</th>
                <th className="hx-th" style={{ textAlign: 'right' }}>Val. 100%</th>
                <th className="hx-th" style={{ textAlign: 'right' }}>Val. noct.</th>
                <th className="hx-th" style={{ textAlign: 'right' }}>Val. fer.</th>
                <th className="hx-th" style={{ textAlign: 'right', background: 'var(--c-sea-50)', color: 'var(--brand-strong)' }}>Total RD$</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <SkeletonTableRows
                  columns={13}
                  rows={10}
                  align={['left', 'left', 'left', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right']}
                />
              )}
              {!isLoading && filas.length === 0 && (
                <tr>
                  <td className="hx-td" colSpan={13}>
                    <div className="hx-empty">
                      {filtrando
                        ? 'Ningún empleado coincide con tu búsqueda.'
                        : 'Sin registros en este periodo todavía.'}
                    </div>
                  </td>
                </tr>
              )}
              {filas.map((f) => (
                <Fragment key={f.empleado.id}>
                  <tr className="hx-row hx-row-in" style={{ cursor: 'pointer' }} onClick={() => setExpandido((s) => ({ ...s, [f.empleado.id]: !s[f.empleado.id] }))}>
                    <td className="hx-td" style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>{expandido[f.empleado.id] ? '▾' : '▸'}</td>
                    <td className="hx-td tnum">{f.empleado.codigo}</td>
                    <td className="hx-td">
                      <div style={{ fontWeight: 600 }}>{f.empleado.nombre}</div>
                      {f.retroactivo && f.retroactivo.dias > 0 && (
                        <div style={{ fontSize: 11, color: 'var(--c-sun-400)', marginTop: 2 }}>
                          incluye {formatMonto(f.retroactivo.monto)} de {f.retroactivo.dias} día{f.retroactivo.dias === 1 ? '' : 's'} retroactivo{f.retroactivo.dias === 1 ? '' : 's'}
                        </div>
                      )}
                    </td>
                    <td className="hx-td tnum" style={{ textAlign: 'right' }}>{formatNumero(f.salarioHora)}</td>
                    <td className="hx-td tnum" style={{ textAlign: 'right' }}>{formatNumero(f.horas.he35)}</td>
                    <td className="hx-td tnum" style={{ textAlign: 'right' }}>{formatNumero(f.horas.he100)}</td>
                    <td className="hx-td tnum" style={{ textAlign: 'right' }}>{formatNumero(f.horas.nocturna)}</td>
                    <td className="hx-td tnum" style={{ textAlign: 'right' }}>{formatNumero(f.horas.feriado)}</td>
                    <td className="hx-td tnum" style={{ textAlign: 'right' }}>{formatNumero(f.montos.he35)}</td>
                    <td className="hx-td tnum" style={{ textAlign: 'right' }}>{formatNumero(f.montos.he100)}</td>
                    <td className="hx-td tnum" style={{ textAlign: 'right' }}>{formatNumero(f.montos.nocturna)}</td>
                    <td className="hx-td tnum" style={{ textAlign: 'right' }}>{formatNumero(f.montos.feriado)}</td>
                    <td className="hx-td tnum" style={{ textAlign: 'right', fontWeight: 700, background: 'var(--c-sea-50)', color: 'var(--brand-strong)' }}>{formatMonto(f.total)}</td>
                  </tr>
                  {expandido[f.empleado.id] && (
                    <ExpandedRow periodoId={periodoActivoId as string} empleadoId={f.empleado.id} />
                  )}
                </Fragment>
              ))}
            </tbody>
            {filas.length > 0 && (
              <tfoot>
                <tr style={{ background: 'var(--c-ink-900)', color: 'var(--text-on-ink)' }}>
                  <td className="hx-td" style={{ border: 'none' }} />
                  <td className="hx-td" style={{ border: 'none', color: 'inherit', fontWeight: 700 }} colSpan={3}>
                    {filtrando ? 'SUBTOTAL FILTRADO' : 'GRAN TOTAL'} · {filas.length} empleado{filas.length === 1 ? '' : 's'}
                  </td>
                  <td className="hx-td tnum" style={{ border: 'none', textAlign: 'right', color: 'inherit' }}>{formatNumero(totales.he35)}</td>
                  <td className="hx-td tnum" style={{ border: 'none', textAlign: 'right', color: 'inherit' }}>{formatNumero(totales.he100)}</td>
                  <td className="hx-td tnum" style={{ border: 'none', textAlign: 'right', color: 'inherit' }}>{formatNumero(totales.nocturna)}</td>
                  <td className="hx-td tnum" style={{ border: 'none', textAlign: 'right', color: 'inherit' }}>{formatNumero(totales.feriado)}</td>
                  <td className="hx-td tnum" style={{ border: 'none', textAlign: 'right', color: 'inherit' }}>{formatNumero(totales.v35)}</td>
                  <td className="hx-td tnum" style={{ border: 'none', textAlign: 'right', color: 'inherit' }}>{formatNumero(totales.v100)}</td>
                  <td className="hx-td tnum" style={{ border: 'none', textAlign: 'right', color: 'inherit' }}>{formatNumero(totales.vNocturna)}</td>
                  <td className="hx-td tnum" style={{ border: 'none', textAlign: 'right', color: 'inherit' }}>{formatNumero(totales.vFeriado)}</td>
                  <td className="hx-td tnum" style={{ border: 'none', textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--c-sun-400)' }}>
                    {filtrando
                      ? formatMonto(totales.v35 + totales.v100 + totales.vNocturna + totales.vFeriado)
                      : formatMonto(reporte?.granTotal ?? '0')}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {modalCerrar && (
        <div className="hx-overlay" onClick={() => setModalCerrar(false)}>
          <div className="hx-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--c-warning-bg)', color: 'var(--c-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: 22 }}>
              ¿Cerrar el periodo {formatRangoPeriodo(periodoActivo.fechaInicio, periodoActivo.fechaFin)}?
            </h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px', fontSize: 14.5, lineHeight: 1.6 }}>
              Se registrará el total de <strong style={{ color: 'var(--text)' }} className="tnum">{formatMonto(reporte?.granTotal ?? '0')}</strong> como pago final del periodo.
            </p>
            <div style={{ background: 'var(--c-danger-bg)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--c-danger)', marginBottom: 22, fontWeight: 500 }}>
              ⚠ Un periodo cerrado no se puede modificar. No podrás importar ni registrar horas para esta quincena.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" className="hx-btn hx-btn-secondary" onClick={() => setModalCerrar(false)}>Cancelar</button>
              <button type="button" className="hx-btn hx-btn-accent" disabled={cerrar.isPending} onClick={() => cerrar.mutate()}>
                {cerrar.isPending && <Spinner />}
                {cerrar.isPending ? 'Cerrando…' : 'Sí, cerrar periodo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
