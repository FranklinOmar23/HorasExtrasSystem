import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmpleadoDrawer } from '../components/EmpleadoDrawer';
import { PageHeader } from '../components/PageHeader';
import { SkeletonLine, SkeletonTableRows } from '../components/Skeleton';
import { listarEmpleados, listarSalarios } from '../api/empleados';
import type { Empleado } from '../types/api';
import { formatMonto } from '../utils/format';

type Filtro = 'all' | 'active' | 'inactive';

export function EmpleadosPage() {
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('all');
  const [drawer, setDrawer] = useState<'closed' | 'new' | Empleado>('closed');

  const { data: empleados = [], isLoading } = useQuery({
    queryKey: ['empleados', query, filtro],
    queryFn: () =>
      listarEmpleados({
        search: query || undefined,
        activo: filtro === 'all' ? undefined : filtro === 'active',
      }),
  });

  return (
    <div className="hx-page">
      <PageHeader
        eyebrow="Plantilla"
        title="Empleados"
        actions={
          <button type="button" className="hx-btn hx-btn-primary hx-btn-sm" onClick={() => setDrawer('new')}>
            + Nuevo empleado
          </button>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 400 }}>
          <input
            className="hx-in"
            placeholder="Buscar por nombre, código o cédula…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="hx-pill-tabs">
          <button type="button" className={`hx-pill${filtro === 'all' ? ' active' : ''}`} onClick={() => setFiltro('all')}>Todos</button>
          <button type="button" className={`hx-pill${filtro === 'active' ? ' active' : ''}`} onClick={() => setFiltro('active')}>Activos</button>
          <button type="button" className={`hx-pill${filtro === 'inactive' ? ' active' : ''}`} onClick={() => setFiltro('inactive')}>Inactivos</button>
        </div>
      </div>

      <div className="hx-table-wrap">
        <table className="hx-table">
          <thead>
            <tr>
              <th className="hx-th">Código</th>
              <th className="hx-th">Nombre</th>
              <th className="hx-th">Cédula</th>
              <th className="hx-th">Posición</th>
              <th className="hx-th" style={{ textAlign: 'right' }}>Salario mensual</th>
              <th className="hx-th">Estado</th>
              <th className="hx-th" style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <SkeletonTableRows columns={7} rows={8} align={['left', 'left', 'left', 'left', 'right', 'left', 'right']} />
            )}
            {!isLoading && empleados.length === 0 && (
              <tr><td className="hx-td" colSpan={7}><div className="hx-empty">Sin empleados que coincidan.</div></td></tr>
            )}
            {!isLoading && empleados.map((e) => (
              <EmpleadoRow key={e.id} empleado={e} onEditar={() => setDrawer(e)} />
            ))}
          </tbody>
        </table>
      </div>

      {drawer !== 'closed' && (
        <EmpleadoDrawer empleado={drawer === 'new' ? null : drawer} onClose={() => setDrawer('closed')} />
      )}
    </div>
  );
}

function EmpleadoRow({ empleado, onEditar }: { empleado: Empleado; onEditar: () => void }) {
  const { data: salarios, isLoading: cargandoSalario } = useQuery({
    queryKey: ['salarios', empleado.id, 'resumen'],
    queryFn: () => listarSalarios(empleado.id),
  });
  const actual = salarios?.find((s) => s.vigenteHasta === null);

  return (
    <tr className="hx-row hx-row-in">
      <td className="hx-td tnum">{empleado.codigo}</td>
      <td className="hx-td" style={{ fontWeight: 600 }}>{empleado.nombre}</td>
      <td className="hx-td tnum" style={{ color: 'var(--text-secondary)' }}>{empleado.cedula ?? '—'}</td>
      <td className="hx-td" style={{ color: 'var(--text-secondary)' }}>{empleado.posicion}</td>
      <td className="hx-td tnum" style={{ textAlign: 'right' }}>
        {cargandoSalario ? <SkeletonLine width={70} align="right" /> : actual ? formatMonto(actual.montoMensual) : '—'}
      </td>
      <td className="hx-td">
        <span className={`hx-badge ${empleado.activo ? 'hx-badge-success' : 'hx-badge-neutral'}`}>
          {empleado.activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td className="hx-td" style={{ textAlign: 'right' }}>
        <span onClick={onEditar} style={{ color: 'var(--brand-strong)', cursor: 'pointer', fontWeight: 600 }}>Editar</span>
      </td>
    </tr>
  );
}
