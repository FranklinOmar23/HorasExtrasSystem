import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actualizarUsuario, crearUsuario } from '../api/usuarios';
import { mensajeError } from '../api/client';
import type { RolUsuario, Usuario } from '../types/api';
import { Spinner } from './Spinner';

export function UsuarioDrawer({ usuario, onClose }: { usuario: Usuario | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const esNuevo = usuario === null;

  const [nombre, setNombre] = useState(usuario?.nombre ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [rol, setRol] = useState<RolUsuario>(usuario?.rol ?? 'RRHH');
  const [activo, setActivo] = useState(usuario?.activo ?? true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const guardar = useMutation({
    mutationFn: async () => {
      if (esNuevo) {
        return crearUsuario({ nombre, email, password, rol });
      }
      return actualizarUsuario(usuario.id, {
        nombre,
        rol,
        activo,
        password: password || undefined,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      onClose();
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo guardar el usuario.')),
  });

  const puedeGuardar = nombre.trim() !== '' && (esNuevo ? email.trim() !== '' && password.length >= 6 : true);

  return (
    <div className="hx-drawer-overlay" onClick={onClose}>
      <div className="hx-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="hx-drawer-head">
          <div>
            <div className="hx-eyebrow">{esNuevo ? 'Nuevo usuario' : `Usuario · ${usuario.email}`}</div>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>{esNuevo ? 'Crear usuario' : 'Editar usuario'}</h2>
          </div>
          <span onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 6 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </div>
        <div className="hx-drawer-body">
          {error && (
            <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}
          <label className="hx-label">Nombre completo
            <input className="hx-in" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>
          <label className="hx-label">Email
            <input className="hx-in" type="email" value={email} disabled={!esNuevo} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <label className="hx-label">Rol
              <select className="hx-in" value={rol} onChange={(e) => setRol(e.target.value as RolUsuario)}>
                <option value="ADMIN">Administrador</option>
                <option value="RRHH">RRHH / Digitador</option>
              </select>
            </label>
            {!esNuevo && (
              <label className="hx-label">Estado
                <select className="hx-in" value={activo ? 'activo' : 'inactivo'} onChange={(e) => setActivo(e.target.value === 'activo')}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </label>
            )}
          </div>
          <label className="hx-label">{esNuevo ? 'Contraseña' : 'Nueva contraseña (opcional)'}
            <input
              className="hx-in"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={esNuevo ? 'Mínimo 6 caracteres' : 'Dejar en blanco para no cambiarla'}
            />
          </label>
        </div>
        <div className="hx-drawer-foot">
          <button type="button" className="hx-btn hx-btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="button" className="hx-btn hx-btn-primary" disabled={!puedeGuardar || guardar.isPending} onClick={() => guardar.mutate()}>
            {guardar.isPending && <Spinner />}
            {guardar.isPending ? 'Guardando…' : 'Guardar usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}
