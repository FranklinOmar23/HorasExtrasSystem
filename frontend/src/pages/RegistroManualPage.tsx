import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/PageHeader';
import { SkeletonTableRows } from '../components/Skeleton';
import { Spinner } from '../components/Spinner';
import { usePeriodoActivo } from '../periodos/PeriodoContext';
import { listarEmpleados } from '../api/empleados';
import { mensajeError } from '../api/client';
import {
  actualizarRegistro,
  crearRegistro,
  eliminarRegistro,
  listarRegistros,
  previewCalculo,
} from '../api/registros';
import type { Empleado, RegistroHoras } from '../types/api';
import { etiquetaTipoHora, formatFechaDia, formatMonto, formatNumero } from '../utils/format';

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

const FORM_VACIO = {
  fecha: hoy(),
  horaEntrada: '08:30',
  horaSalida: '17:30',
  comentario: '',
};

const TAMANO_PAGINA = 10;

export function RegistroManualPage() {
  const queryClient = useQueryClient();
  const { periodoActivo, periodoActivoId, cargando: cargandoPeriodos } = usePeriodoActivo();

  const [regQuery, setRegQuery] = useState('');
  const [regFocus, setRegFocus] = useState(false);
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [pagina, setPagina] = useState(1);

  const { data: candidatos = [] } = useQuery({
    queryKey: ['empleados-buscar', regQuery],
    queryFn: () => listarEmpleados({ search: regQuery || undefined, activo: true }),
    enabled: regFocus,
  });

  const { data: empleadosTodos = [] } = useQuery({
    queryKey: ['empleados-todos'],
    queryFn: () => listarEmpleados({}),
  });
  const empleadosPorId = useMemo(() => new Map(empleadosTodos.map((e) => [e.id, e])), [empleadosTodos]);

  const { data: registros = [], isLoading: cargandoRegistros } = useQuery({
    queryKey: ['registros', periodoActivoId],
    queryFn: () => listarRegistros(periodoActivoId as string),
    enabled: !!periodoActivoId,
  });
  const ordenados = useMemo(
    () => [...registros].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [registros],
  );
  const totalPaginas = Math.max(1, Math.ceil(ordenados.length / TAMANO_PAGINA));
  const recientes = useMemo(
    () => ordenados.slice((pagina - 1) * TAMANO_PAGINA, pagina * TAMANO_PAGINA),
    [ordenados, pagina],
  );

  useEffect(() => {
    setPagina(1);
  }, [periodoActivoId]);

  useEffect(() => {
    setPagina((p) => Math.min(p, totalPaginas));
  }, [totalPaginas]);

  const previewHabilitado = !!empleado && !!form.fecha && !!form.horaEntrada && !!form.horaSalida;
  const { data: preview, isFetching: cargandoPreview } = useQuery({
    queryKey: ['preview-calculo', empleado?.id, form.fecha, form.horaEntrada, form.horaSalida],
    queryFn: () =>
      previewCalculo({
        empleadoId: empleado!.id,
        fecha: form.fecha,
        horaEntrada: form.horaEntrada,
        horaSalida: form.horaSalida,
      }),
    enabled: previewHabilitado,
    retry: false,
  });

  function limpiar() {
    setEmpleado(null);
    setRegQuery('');
    setForm(FORM_VACIO);
    setEditandoId(null);
    setError(null);
    setAviso(null);
  }

  const guardar = useMutation({
    mutationFn: async () => {
      if (!empleado || !periodoActivoId) throw new Error('Selecciona un empleado.');
      if (editandoId) {
        return actualizarRegistro(editandoId, { ...form, comentario: form.comentario || undefined });
      }
      return crearRegistro({
        periodoId: periodoActivoId,
        empleadoId: empleado.id,
        ...form,
        comentario: form.comentario || undefined,
      });
    },
    onSuccess: () => {
      setAviso(editandoId ? 'Registro actualizado.' : 'Registro guardado.');
      setError(null);
      limpiar();
      void queryClient.invalidateQueries({ queryKey: ['registros', periodoActivoId] });
      void queryClient.invalidateQueries({ queryKey: ['reporte-periodo'] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo guardar el registro.')),
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => eliminarRegistro(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['registros', periodoActivoId] });
      void queryClient.invalidateQueries({ queryKey: ['reporte-periodo'] });
    },
    onError: (err) => setError(mensajeError(err, 'No se pudo eliminar el registro.')),
  });

  const eliminarVarios = useMutation({
    mutationFn: async (ids: string[]) => {
      const resultados = await Promise.allSettled(ids.map((id) => eliminarRegistro(id)));
      const fallidos = resultados.filter((r) => r.status === 'rejected');
      if (fallidos.length > 0) {
        throw new Error(
          fallidos.length === ids.length
            ? 'No se pudo eliminar ninguno de los registros seleccionados.'
            : `Se eliminaron ${ids.length - fallidos.length} de ${ids.length}; ${fallidos.length} no se pudieron eliminar (¿periodo cerrado?).`,
        );
      }
    },
    onSuccess: () => {
      setAviso('Registros eliminados.');
      setError(null);
      setSeleccionados(new Set());
      void queryClient.invalidateQueries({ queryKey: ['registros', periodoActivoId] });
      void queryClient.invalidateQueries({ queryKey: ['reporte-periodo'] });
    },
    onError: (err) => {
      setError(mensajeError(err, 'No se pudieron eliminar los registros seleccionados.'));
      setSeleccionados(new Set());
      void queryClient.invalidateQueries({ queryKey: ['registros', periodoActivoId] });
      void queryClient.invalidateQueries({ queryKey: ['reporte-periodo'] });
    },
  });

  function alternarSeleccion(id: string) {
    setSeleccionados((actual) => {
      const nuevo = new Set(actual);
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });
  }

  function confirmarEliminarVarios() {
    const ids = [...seleccionados];
    if (ids.length === 0) return;
    if (confirm(`¿Eliminar ${ids.length} registro${ids.length === 1 ? '' : 's'} seleccionado${ids.length === 1 ? '' : 's'}?`)) {
      eliminarVarios.mutate(ids);
    }
  }

  function editar(r: RegistroHoras) {
    const emp = empleadosPorId.get(r.empleadoId);
    setEmpleado(emp ?? null);
    setRegQuery(emp ? `${emp.codigo} · ${emp.nombre}` : '');
    setForm({ fecha: r.fecha, horaEntrada: r.horaEntrada, horaSalida: r.horaSalida, comentario: r.comentario ?? '' });
    setEditandoId(r.id);
    setAviso(null);
    setError(null);
  }

  const resultados = candidatos.slice(0, 6);
  const totalPreview = (preview ?? []).reduce((acc, c) => acc + Number(c.monto), 0);

  if (cargandoPeriodos) {
    return (
      <div className="hx-page">
        <PageHeader eyebrow="Entrada individual" title="Registro manual de horas" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
          <div className="hx-card" style={{ padding: 24 }}><span className="hx-skel hx-skel-block" style={{ display: 'block', width: '100%', height: 240 }} /></div>
          <div className="hx-card" style={{ padding: 24 }}><span className="hx-skel hx-skel-block" style={{ display: 'block', width: '100%', height: 240 }} /></div>
        </div>
      </div>
    );
  }

  if (!periodoActivo) {
    return (
      <div className="hx-page">
        <PageHeader eyebrow="Entrada individual" title="Registro manual de horas" />
        <div className="hx-card hx-empty">No hay ningún periodo disponible.</div>
      </div>
    );
  }

  return (
    <div className="hx-page">
      <PageHeader eyebrow="Entrada individual" title="Registro manual de horas" />

      {error && (
        <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 16, maxWidth: 900 }}>
          {error}
        </div>
      )}
      {aviso && !error && (
        <div style={{ background: 'var(--c-success-bg)', color: 'var(--c-success)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 16, maxWidth: 900 }}>
          {aviso}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, alignItems: 'start' }}>
        <div className="hx-card" style={{ padding: 24 }}>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Empleado</label>
            <input
              className="hx-in"
              placeholder="Buscar por código o nombre…"
              value={regQuery}
              disabled={!!editandoId}
              onChange={(e) => { setRegQuery(e.target.value); setRegFocus(true); setEmpleado(null); }}
              onFocus={() => setRegFocus(true)}
            />
            {regFocus && !editandoId && (
              <div
                style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', zIndex: 5, maxHeight: 240, overflowY: 'auto' }}
              >
                {resultados.map((e) => (
                  <div
                    key={e.id}
                    className="hx-navitem"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}
                    onClick={() => {
                      setEmpleado(e);
                      setRegQuery(`${e.codigo} · ${e.nombre}`);
                      setRegFocus(false);
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--c-sea-50)', color: 'var(--brand-strong)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                      {e.codigo}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{e.nombre}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{e.posicion}</div>
                    </div>
                  </div>
                ))}
                {resultados.length === 0 && (
                  <div style={{ padding: 14, fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center' }}>Sin resultados</div>
                )}
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
            <label className="hx-label">Fecha
              <input className="hx-in" type="date" value={form.fecha} onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))} />
            </label>
            <label className="hx-label">Hora entrada
              <input className="hx-in" type="time" value={form.horaEntrada} onChange={(e) => setForm((f) => ({ ...f, horaEntrada: e.target.value }))} />
            </label>
            <label className="hx-label">Hora salida
              <input className="hx-in" type="time" value={form.horaSalida} onChange={(e) => setForm((f) => ({ ...f, horaSalida: e.target.value }))} />
            </label>
          </div>
          <label className="hx-label" style={{ marginBottom: 20 }}>Comentario
            <input
              className="hx-in"
              placeholder="Ej: montaje de rótulo urgente — cliente Bravo"
              value={form.comentario}
              onChange={(e) => setForm((f) => ({ ...f, comentario: e.target.value }))}
            />
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              className="hx-btn hx-btn-primary"
              disabled={!empleado || guardar.isPending}
              onClick={() => guardar.mutate()}
            >
              {guardar.isPending && <Spinner />}
              {guardar.isPending ? 'Guardando…' : editandoId ? 'Actualizar registro' : 'Guardar registro'}
            </button>
            <button type="button" className="hx-btn hx-btn-secondary" onClick={limpiar}>
              {editandoId ? 'Cancelar' : 'Limpiar'}
            </button>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg,var(--c-sea-800),var(--c-ink-900))', color: 'var(--text-on-ink)', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-md)', borderTop: '3px solid var(--accent)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 16 }}>
            Vista previa del cálculo
          </div>
          {!empleado ? (
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,.7)' }}>Selecciona un empleado para ver el cálculo.</div>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{empleado.nombre}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 20 }}>{empleado.posicion}</div>
              {cargandoPreview ? (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Spinner size={13} /> Calculando…
                </div>
              ) : !preview || preview.length === 0 ? (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>Sin exceso de horas para estos datos (jornada normal).</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
                  {preview.map((c, i) => {
                    const etiqueta = etiquetaTipoHora(c.tipoHoraCodigo);
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255,255,255,.7)' }}>{etiqueta.texto} · {formatNumero(c.cantidadHoras)}h</span>
                        <span className="tnum" style={{ fontWeight: 600 }}>{formatMonto(c.monto)}</span>
                      </div>
                    );
                  })}
                  <div style={{ height: 1, background: 'rgba(255,255,255,.14)', margin: '6px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ color: 'rgba(255,255,255,.7)' }}>Total a pagar</span>
                    <span className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--c-sun-400)' }}>
                      {formatMonto(totalPreview)}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '32px 0 14px' }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Registros del periodo</h3>
        {seleccionados.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{seleccionados.size} seleccionado{seleccionados.size === 1 ? '' : 's'}</span>
            <button type="button" className="hx-btn hx-btn-secondary hx-btn-sm" onClick={() => setSeleccionados(new Set())}>
              Cancelar
            </button>
            <button
              type="button"
              className="hx-btn hx-btn-sm"
              style={{ background: 'var(--c-danger)', color: 'var(--text-on-brand)' }}
              disabled={eliminarVarios.isPending}
              onClick={confirmarEliminarVarios}
            >
              {eliminarVarios.isPending && <Spinner size={12} />}
              {eliminarVarios.isPending ? 'Eliminando…' : `Eliminar seleccionados (${seleccionados.size})`}
            </button>
          </div>
        )}
      </div>
      <div className="hx-table-wrap">
        <table className="hx-table">
          <thead>
            <tr>
              <th className="hx-th" style={{ width: 36 }}>
                <input
                  type="checkbox"
                  checked={recientes.length > 0 && recientes.every((r) => seleccionados.has(r.id))}
                  onChange={(e) => setSeleccionados(e.target.checked ? new Set(recientes.map((r) => r.id)) : new Set())}
                />
              </th>
              <th className="hx-th">Fecha</th>
              <th className="hx-th">Código</th>
              <th className="hx-th">Empleado</th>
              <th className="hx-th">Entrada</th>
              <th className="hx-th">Salida</th>
              <th className="hx-th">Tipo</th>
              <th className="hx-th" style={{ textAlign: 'right' }}>Valor</th>
              <th className="hx-th" style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargandoRegistros && (
              <SkeletonTableRows columns={9} rows={5} align={['left', 'left', 'left', 'left', 'left', 'left', 'left', 'right', 'right']} />
            )}
            {!cargandoRegistros && recientes.map((r) => {
              const emp = empleadosPorId.get(r.empleadoId);
              const total = r.calculos.reduce((acc, c) => acc + Number(c.monto), 0);
              const marcado = seleccionados.has(r.id);
              return (
                <tr key={r.id} className="hx-row hx-row-in" style={marcado ? { background: 'var(--c-sea-50)' } : undefined}>
                  <td className="hx-td">
                    <input type="checkbox" checked={marcado} onChange={() => alternarSeleccion(r.id)} />
                  </td>
                  <td className="hx-td tnum">{formatFechaDia(r.fecha)}</td>
                  <td className="hx-td tnum">{emp?.codigo ?? '—'}</td>
                  <td className="hx-td" style={{ fontWeight: 600 }}>{emp?.nombre ?? '—'}</td>
                  <td className="hx-td tnum">{r.horaEntrada}</td>
                  <td className="hx-td tnum">{r.horaSalida}</td>
                  <td className="hx-td">
                    {r.calculos.length === 0 ? (
                      <span className="hx-badge hx-badge-neutral">Normal</span>
                    ) : (
                      r.calculos.map((c, i) => {
                        const et = etiquetaTipoHora(c.tipoHoraCodigo);
                        return <span key={i} className={`hx-badge hx-badge-${et.tono}`} style={{ marginRight: 4 }}>{et.texto}</span>;
                      })
                    )}
                  </td>
                  <td className="hx-td tnum" style={{ textAlign: 'right', fontWeight: 700 }}>{formatMonto(total)}</td>
                  <td className="hx-td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span style={{ color: 'var(--brand-strong)', cursor: 'pointer', marginRight: 12, fontWeight: 600 }} onClick={() => editar(r)}>Editar</span>
                    <span style={{ color: 'var(--c-danger)', cursor: 'pointer', fontWeight: 600 }} onClick={() => { if (confirm('¿Eliminar este registro?')) eliminar.mutate(r.id); }}>Eliminar</span>
                  </td>
                </tr>
              );
            })}
            {!cargandoRegistros && recientes.length === 0 && (
              <tr><td className="hx-td" colSpan={9}><div className="hx-empty">Sin registros todavía en este periodo.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
      {!cargandoRegistros && ordenados.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Mostrando {(pagina - 1) * TAMANO_PAGINA + 1}–{Math.min(pagina * TAMANO_PAGINA, ordenados.length)} de {ordenados.length}
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
    </div>
  );
}
