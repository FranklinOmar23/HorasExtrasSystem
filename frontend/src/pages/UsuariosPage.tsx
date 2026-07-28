import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../components/PageHeader';
import { SkeletonTableRows } from '../components/Skeleton';
import { UsuarioDrawer } from '../components/UsuarioDrawer';
import { useAuth } from '../auth/AuthContext';
import { listarUsuarios } from '../api/usuarios';
import type { Usuario } from '../types/api';

export function UsuariosPage() {
  const { usuario: usuarioActual } = useAuth();
  const [drawer, setDrawer] = useState<'closed' | 'new' | Usuario>('closed');

  const { data: usuarios = [], isLoading } = useQuery({ queryKey: ['usuarios'], queryFn: listarUsuarios });

  if (usuarioActual?.rol !== 'ADMIN') {
    return (
      <div className="hx-page">
        <PageHeader eyebrow="Acceso" title="Usuarios" />
        <div className="hx-card hx-empty">Solo un administrador puede ver esta pantalla.</div>
      </div>
    );
  }

  return (
    <div className="hx-page">
      <PageHeader
        eyebrow="Acceso al sistema"
        title="Usuarios"
        actions={
          <button type="button" className="hx-btn hx-btn-primary hx-btn-sm" onClick={() => setDrawer('new')}>
            + Nuevo usuario
          </button>
        }
      />

      <div className="hx-table-wrap">
        <table className="hx-table">
          <thead>
            <tr>
              <th className="hx-th">Nombre</th>
              <th className="hx-th">Email</th>
              <th className="hx-th">Rol</th>
              <th className="hx-th">Estado</th>
              <th className="hx-th" style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <SkeletonTableRows columns={5} rows={5} align={['left', 'left', 'left', 'left', 'right']} />
            )}
            {!isLoading && usuarios.length === 0 && (
              <tr><td className="hx-td" colSpan={5}><div className="hx-empty">Sin usuarios registrados.</div></td></tr>
            )}
            {!isLoading && usuarios.map((u) => (
              <tr key={u.id} className="hx-row hx-row-in">
                <td className="hx-td" style={{ fontWeight: 600 }}>
                  {u.nombre}
                  {u.id === usuarioActual?.id && <span className="hx-badge hx-badge-sea" style={{ marginLeft: 8 }}>Tú</span>}
                </td>
                <td className="hx-td" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                <td className="hx-td">
                  <span className={`hx-badge ${u.rol === 'ADMIN' ? 'hx-badge-coral' : 'hx-badge-neutral'}`}>
                    {u.rol === 'ADMIN' ? 'Administrador' : 'RRHH / Digitador'}
                  </span>
                </td>
                <td className="hx-td">
                  <span className={`hx-badge ${u.activo ? 'hx-badge-success' : 'hx-badge-neutral'}`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="hx-td" style={{ textAlign: 'right' }}>
                  <span onClick={() => setDrawer(u)} style={{ color: 'var(--brand-strong)', cursor: 'pointer', fontWeight: 600 }}>Editar</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drawer !== 'closed' && (
        <UsuarioDrawer usuario={drawer === 'new' ? null : drawer} onClose={() => setDrawer('closed')} />
      )}
    </div>
  );
}
