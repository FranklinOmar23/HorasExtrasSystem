import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/PageHeader';
import { usePeriodoActivo } from '../periodos/PeriodoContext';
import { confirmarImportacion, subirImportacion } from '../api/importaciones';
import { mensajeError } from '../api/client';
import type { Importacion, ParsearImportacionRespuesta } from '../types/api';

const PASOS = [
  { n: 1, label: 'Subir archivo', sub: 'Arrastra el .xlsx' },
  { n: 2, label: 'Previsualizar', sub: 'Revisa las filas' },
  { n: 3, label: 'Confirmar', sub: 'Resumen final' },
];

function estiloBadgeFila(estado: string): { clase: string; texto: string } {
  if (estado === 'OK') return { clase: 'hx-badge-success', texto: '✓ Válida' };
  if (estado === 'ADVERTENCIA') return { clase: 'hx-badge-warning', texto: '⚠ Advertencia' };
  return { clase: 'hx-badge-danger', texto: '✗ Error' };
}

export function ImportarPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { periodoActivo, periodoActivoId } = usePeriodoActivo();

  const [paso, setPaso] = useState(1);
  const [resultado, setResultado] = useState<ParsearImportacionRespuesta | null>(null);
  const [incluirAdvertencias, setIncluirAdvertencias] = useState(false);
  const [confirmacion, setConfirmacion] = useState<Importacion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subir = useMutation({
    mutationFn: (archivo: File) => subirImportacion(periodoActivoId as string, archivo),
    onSuccess: (data) => {
      setResultado(data);
      setError(null);
      setPaso(2);
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo leer el archivo.')),
  });

  const confirmar = useMutation({
    mutationFn: () =>
      confirmarImportacion(resultado!.importacionId, incluirAdvertencias),
    onSuccess: (data) => {
      setConfirmacion(data);
      setPaso(3);
      void queryClient.invalidateQueries({ queryKey: ['registros'] });
      void queryClient.invalidateQueries({ queryKey: ['reporte-periodo'] });
      void queryClient.invalidateQueries({ queryKey: ['historico'] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo confirmar la importación.')),
  });

  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0]) {
        setError(null);
        subir.mutate(files[0]);
      }
    },
    [subir],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  function reiniciar() {
    setPaso(1);
    setResultado(null);
    setConfirmacion(null);
    setError(null);
    setIncluirAdvertencias(false);
  }

  if (!periodoActivo) {
    return (
      <div className="hx-page">
        <PageHeader eyebrow="Carga de datos" title="Importar Excel" />
        <div className="hx-card hx-empty">No hay ningún periodo disponible para importar.</div>
      </div>
    );
  }

  const numOk = resultado?.filas.filter((f) => f.estado === 'OK').length ?? 0;
  const numAdvertencia = resultado?.filas.filter((f) => f.estado === 'ADVERTENCIA').length ?? 0;
  const numError = resultado?.filas.filter((f) => f.estado === 'ERROR').length ?? 0;
  const aConfirmar = numOk + (incluirAdvertencias ? numAdvertencia : 0);

  return (
    <div className="hx-page">
      <PageHeader eyebrow="Carga de datos" title="Importar Excel" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, maxWidth: 720 }}>
        {PASOS.map((s, i) => {
          const done = paso > s.n;
          const active = paso === s.n;
          return (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    flex: 'none',
                    fontFamily: 'var(--font-display)',
                    background: done ? 'var(--brand)' : active ? 'var(--c-sea-50)' : 'var(--c-paper-2)',
                    color: done ? 'var(--text-on-brand)' : active ? 'var(--brand-strong)' : 'var(--text-tertiary)',
                    border: active ? '2px solid var(--brand)' : 'none',
                  }}
                >
                  {done ? '✓' : s.n}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: done || active ? 'var(--text)' : 'var(--text-tertiary)' }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s.sub}</div>
                </div>
              </div>
              {i < PASOS.length - 1 && (
                <div style={{ flex: 1, height: 2, margin: '0 14px', background: done ? 'var(--brand)' : 'var(--border)', borderRadius: 2 }} />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div style={{ maxWidth: 720, background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {paso === 1 && (
        <div {...getRootProps()} className={`hx-dropzone${isDragActive ? ' active' : ''}`}>
          <input {...getInputProps()} />
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--c-sea-50)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
            {subir.isPending ? 'Leyendo archivo…' : 'Arrastra tu archivo .xlsx aquí'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>o haz clic para seleccionarlo desde tu equipo</div>
          <div className="hx-btn hx-btn-primary" style={{ display: 'inline-flex', marginTop: 20, height: 42 }}>
            Seleccionar archivo
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 18, fontFamily: 'var(--font-mono)' }}>
            Formato esperado: fecha · código · nombre · hora entrada · hora salida — periodo {periodoActivo.fechaInicio} a {periodoActivo.fechaFin}
          </div>
        </div>
      )}

      {paso === 2 && resultado && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="hx-badge hx-badge-success">{numOk} válidas</span>
            <span className="hx-badge hx-badge-warning">{numAdvertencia} advertencias</span>
            <span className="hx-badge hx-badge-danger">{numError} errores</span>
            <div style={{ flex: 1 }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={incluirAdvertencias}
                onChange={(e) => setIncluirAdvertencias(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--brand)' }}
              />
              Incluir filas con advertencia
            </label>
          </div>
          <div className="hx-table-wrap">
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              <table className="hx-table">
                <thead>
                  <tr>
                    <th className="hx-th">Estado</th>
                    <th className="hx-th">Fecha</th>
                    <th className="hx-th">Código</th>
                    <th className="hx-th">Nombre</th>
                    <th className="hx-th">Entrada</th>
                    <th className="hx-th">Salida</th>
                    <th className="hx-th">Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.filas.map((f) => {
                    const badge = estiloBadgeFila(f.estado);
                    return (
                      <tr key={f.linea} className="hx-row">
                        <td className="hx-td"><span className={`hx-badge ${badge.clase}`}>{badge.texto}</span></td>
                        <td className="hx-td tnum">{f.fecha ?? '—'}</td>
                        <td className="hx-td tnum">{f.codigo ?? '—'}</td>
                        <td className="hx-td" style={{ fontWeight: 600 }}>{f.nombre ?? '—'}</td>
                        <td className="hx-td tnum">{f.entrada ?? '—'}</td>
                        <td className="hx-td tnum">{f.salida ?? '—'}</td>
                        <td className="hx-td" style={{ color: f.estado === 'ERROR' ? 'var(--c-danger)' : f.estado === 'ADVERTENCIA' ? 'var(--c-warning)' : 'var(--text-tertiary)', fontSize: 12.5 }}>
                          {f.mensajes.join(' · ') || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
            <button type="button" className="hx-btn hx-btn-secondary" onClick={reiniciar}>← Volver</button>
            <button
              type="button"
              className="hx-btn hx-btn-primary"
              disabled={aConfirmar === 0 || confirmar.isPending}
              onClick={() => confirmar.mutate()}
            >
              {confirmar.isPending ? 'Confirmando…' : `Confirmar importación (${aConfirmar} válidas)`}
            </button>
          </div>
        </div>
      )}

      {paso === 3 && confirmacion && (
        <div className="hx-card" style={{ maxWidth: 600, padding: '44px 40px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--c-success-bg)', color: 'var(--c-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 26 }}>Importación completada</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 26px' }}>
            Se importaron <strong style={{ color: 'var(--text)' }}>{aConfirmar} registros válidos</strong> al periodo{' '}
            <strong style={{ color: 'var(--text)' }}>{periodoActivo.fechaInicio} – {periodoActivo.fechaFin}</strong>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
            <div style={{ background: 'var(--c-paper-2)', borderRadius: 12, padding: 14 }}>
              <div className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--c-success)' }}>{confirmacion.filasOk}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Válidas</div>
            </div>
            <div style={{ background: 'var(--c-paper-2)', borderRadius: 12, padding: 14 }}>
              <div className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--c-warning)' }}>{confirmacion.filasAdvertencia}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Advertencias</div>
            </div>
            <div style={{ background: 'var(--c-paper-2)', borderRadius: 12, padding: 14 }}>
              <div className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--c-danger)' }}>{confirmacion.filasError}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Con error</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button type="button" className="hx-btn hx-btn-secondary" onClick={reiniciar}>Importar otro</button>
            <button type="button" className="hx-btn hx-btn-primary" onClick={() => navigate('/reporte')}>
              Ver cálculo del periodo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
