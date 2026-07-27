import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '../components/Badge';
import { PageHeader } from '../components/PageHeader';
import { SkeletonTableRows } from '../components/Skeleton';
import { listarAuditoria } from '../api/auditoria';
import { formatFechaHora } from '../utils/format';
import type { AccionAuditoria, EntidadAuditoria } from '../types/api';

const ENTIDADES: { valor: EntidadAuditoria | ''; label: string }[] = [
  { valor: '', label: 'Todas las entidades' },
  { valor: 'PERIODO', label: 'Periodos' },
  { valor: 'EMPLEADO', label: 'Empleados' },
  { valor: 'SALARIO', label: 'Salarios' },
  { valor: 'CONFIGURACION', label: 'Configuración' },
  { valor: 'FERIADO', label: 'Feriados' },
  { valor: 'TIPO_HORA_EXTRA', label: 'Tipos de hora extra' },
  { valor: 'REGISTRO_HORAS', label: 'Registros de horas' },
  { valor: 'IMPORTACION', label: 'Importaciones' },
  { valor: 'USUARIO', label: 'Usuarios' },
];

const LABEL_ENTIDAD: Record<EntidadAuditoria, string> = {
  PERIODO: 'Periodo',
  EMPLEADO: 'Empleado',
  SALARIO: 'Salario',
  CONFIGURACION: 'Configuración',
  FERIADO: 'Feriado',
  TIPO_HORA_EXTRA: 'Tipo de hora extra',
  REGISTRO_HORAS: 'Registro de horas',
  IMPORTACION: 'Importación',
  USUARIO: 'Usuario',
};

const BADGE_ACCION: Record<AccionAuditoria, { tono: 'success' | 'warning' | 'danger' | 'neutral' | 'sea'; texto: string }> = {
  CREAR: { tono: 'success', texto: 'Creó' },
  ACTUALIZAR: { tono: 'sea', texto: 'Actualizó' },
  ELIMINAR: { tono: 'danger', texto: 'Eliminó' },
  CERRAR: { tono: 'neutral', texto: 'Cerró' },
  RESTAURAR: { tono: 'warning', texto: 'Restauró' },
  CONFIRMAR: { tono: 'sea', texto: 'Confirmó' },
};

export function AuditoriaPage() {
  const [entidad, setEntidad] = useState<EntidadAuditoria | ''>('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const { data: auditorias = [], isLoading } = useQuery({
    queryKey: ['auditoria', entidad, desde, hasta],
    queryFn: () =>
      listarAuditoria({
        entidad: entidad || undefined,
        desde: desde || undefined,
        hasta: hasta || undefined,
      }),
  });

  function limpiarFiltros() {
    setEntidad('');
    setDesde('');
    setHasta('');
  }

  const hayFiltros = entidad !== '' || desde !== '' || hasta !== '';

  return (
    <div className="hx-page">
      <PageHeader eyebrow="Seguridad" title="Auditoría" />

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <label className="hx-label" style={{ minWidth: 200 }}>Entidad
          <select className="hx-in" value={entidad} onChange={(e) => setEntidad(e.target.value as EntidadAuditoria | '')}>
            {ENTIDADES.map((e) => (
              <option key={e.valor} value={e.valor}>{e.label}</option>
            ))}
          </select>
        </label>
        <label className="hx-label">Desde
          <input className="hx-in" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </label>
        <label className="hx-label">Hasta
          <input className="hx-in" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </label>
        {hayFiltros && (
          <button type="button" className="hx-btn hx-btn-secondary hx-btn-sm" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="hx-table-wrap">
        <table className="hx-table">
          <thead>
            <tr>
              <th className="hx-th">Fecha</th>
              <th className="hx-th">Usuario</th>
              <th className="hx-th">Acción</th>
              <th className="hx-th">Entidad</th>
              <th className="hx-th">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <SkeletonTableRows columns={5} rows={8} align={['left', 'left', 'left', 'left', 'left']} />
            )}
            {!isLoading && auditorias.map((a) => {
              const badge = BADGE_ACCION[a.accion];
              return (
                <tr key={a.id} className="hx-row hx-row-in">
                  <td className="hx-td tnum" style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{formatFechaHora(a.creadoEn)}</td>
                  <td className="hx-td" style={{ fontWeight: 600 }}>{a.usuarioNombre}</td>
                  <td className="hx-td"><Badge tono={badge.tono}>{badge.texto}</Badge></td>
                  <td className="hx-td">{LABEL_ENTIDAD[a.entidad]}</td>
                  <td className="hx-td" style={{ fontSize: 13 }}>{a.descripcion}</td>
                </tr>
              );
            })}
            {!isLoading && auditorias.length === 0 && (
              <tr><td className="hx-td" colSpan={5}><div className="hx-empty">Sin actividad registrada para este filtro.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
