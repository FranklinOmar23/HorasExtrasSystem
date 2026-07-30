import type { MouseEvent } from 'react';
import { Spinner } from './Spinner';

export function BotonExportarExcel({
  onClick,
  descargando,
  progreso,
  exito,
  disabled,
  etiqueta = 'Exportar Excel',
}: {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  descargando: boolean;
  progreso: number | null;
  exito: boolean;
  disabled?: boolean;
  etiqueta?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
      <button
        type="button"
        className="hx-btn hx-btn-secondary hx-btn-sm"
        onClick={onClick}
        disabled={disabled || descargando}
        style={exito ? { color: 'var(--c-success)', borderColor: 'var(--c-success)' } : undefined}
      >
        {exito ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline className="hx-check-draw" points="20 6 9 17 4 12" />
            </svg>
            ¡Listo!
          </>
        ) : descargando ? (
          <>
            <Spinner size={12} />
            {progreso !== null ? `Descargando ${progreso}%` : 'Descargando…'}
          </>
        ) : (
          etiqueta
        )}
      </button>
      {descargando && (
        <div className="hx-progress-track" style={{ width: 120, height: 5 }}>
          {progreso !== null ? (
            <div className="hx-progress-fill" style={{ width: `${Math.max(6, progreso)}%` }} />
          ) : (
            <div className="hx-progress-fill indeterminate" />
          )}
        </div>
      )}
    </div>
  );
}
