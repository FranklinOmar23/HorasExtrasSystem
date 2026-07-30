import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmpleadoDrawer } from '../components/EmpleadoDrawer';
import { PageHeader } from '../components/PageHeader';
import { SkeletonTableRows } from '../components/Skeleton';
import { listarEmpleados } from '../api/empleados';
import type { EmpleadoConSalario } from '../api/empleados';
import type { Empleado } from '../types/api';
import { formatMonto } from '../utils/format';

type Filtro = 'all' | 'active' | 'inactive';
const POR_PAGINA = 25;

export function EmpleadosPage() {
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('all');
  const [salarioMin, setSalarioMin] = useState('');
  const [salarioMax, setSalarioMax] = useState('');
  const [pagina, setPagina] = useState(1);
  const [drawer, setDrawer] = useState<'closed' | 'new' | Empleado>('closed');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['empleados', query, filtro, salarioMin, salarioMax, pagina],
    queryFn: () =>
      listarEmpleados({
        search: query || undefined,
        activo: filtro === 'all' ? undefined : filtro === 'active',
        salarioMin: salarioMin ? Number(salarioMin) : undefined,
        salarioMax: salarioMax ? Number(salarioMax) : undefined,
        pagina,
        porPagina: POR_PAGINA,
      }),
    placeholderData: (anterior) => anterior,
  });

  const empleados = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPaginas = data?.totalPaginas ?? 1;
  const hayFiltroSalario = salarioMin !== '' || salarioMax !== '';

  useEffect(() => {
    setPagina(1);
  }, [query, filtro, salarioMin, salarioMax]);

  function limpiarFiltroSalario() {
    setSalarioMin('');
    setSalarioMax('');
  }

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

      <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
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

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
          Salario
          <input
            className="hx-in tnum"
            type="number"
            placeholder="Mín."
            value={salarioMin}
            onChange={(e) => setSalarioMin(e.target.value)}
            style={{ width: 110 }}
          />
        </label>
        <span style={{ color: 'var(--text-tertiary)' }}>–</span>
        <input
          className="hx-in tnum"
          type="number"
          placeholder="Máx."
          value={salarioMax}
          onChange={(e) => setSalarioMax(e.target.value)}
          style={{ width: 110 }}
        />
        {hayFiltroSalario && (
          <button type="button" className="hx-btn hx-btn-secondary hx-btn-sm" onClick={limpiarFiltroSalario}>
            Limpiar rango
          </button>
        )}
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

      {!isLoading && total > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Mostrando {(pagina - 1) * POR_PAGINA + 1}–{Math.min(pagina * POR_PAGINA, total)} de {total}
            {isFetching && ' · actualizando…'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="hx-btn hx-btn-secondary hx-btn-sm"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Página {pagina} de {totalPaginas}</span>
            <button
              type="button"
              className="hx-btn hx-btn-secondary hx-btn-sm"
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {drawer !== 'closed' && (
        <EmpleadoDrawer empleado={drawer === 'new' ? null : drawer} onClose={() => setDrawer('closed')} />
      )}
    </div>
  );
}

function EmpleadoRow({ empleado, onEditar }: { empleado: EmpleadoConSalario; onEditar: () => void }) {
  return (
    <tr className="hx-row hx-row-in">
      <td className="hx-td tnum">{empleado.codigo}</td>
      <td className="hx-td" style={{ fontWeight: 600 }}>{empleado.nombre}</td>
      <td className="hx-td tnum" style={{ color: 'var(--text-secondary)' }}>{empleado.cedula ?? '—'}</td>
      <td className="hx-td" style={{ color: 'var(--text-secondary)' }}>{empleado.posicion}</td>
      <td className="hx-td tnum" style={{ textAlign: 'right' }}>
        {empleado.montoMensualVigente ? formatMonto(empleado.montoMensualVigente) : '—'}
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
