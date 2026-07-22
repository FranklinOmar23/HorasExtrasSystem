import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/PageHeader';
import { SkeletonLine, SkeletonTableRows } from '../components/Skeleton';
import { Spinner } from '../components/Spinner';
import { mensajeError } from '../api/client';
import {
  actualizarConfiguracion,
  actualizarTipoHoraExtra,
  crearFeriado,
  eliminarFeriado,
  listarFeriados,
  listarTiposHoraExtra,
  obtenerConfiguracion,
} from '../api/configuracion';
import type { Configuracion, TipoHoraExtra } from '../types/api';

type Tab = 'tipos' | 'jornada' | 'reglas' | 'feriados';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function ConfiguracionPage() {
  const [tab, setTab] = useState<Tab>('tipos');

  return (
    <div className="hx-page">
      <PageHeader eyebrow="Ajustes del sistema" title="Configuración" />
      <div className="hx-tabs">
        <button type="button" className={`hx-tab${tab === 'tipos' ? ' active' : ''}`} onClick={() => setTab('tipos')}>Tipos de hora extra</button>
        <button type="button" className={`hx-tab${tab === 'jornada' ? ' active' : ''}`} onClick={() => setTab('jornada')}>Jornada laboral</button>
        <button type="button" className={`hx-tab${tab === 'reglas' ? ' active' : ''}`} onClick={() => setTab('reglas')}>Reglas de cálculo</button>
        <button type="button" className={`hx-tab${tab === 'feriados' ? ' active' : ''}`} onClick={() => setTab('feriados')}>Feriados</button>
      </div>
      <div key={tab} className="hx-fade-in">
        {tab === 'tipos' && <TabTipos />}
        {tab === 'jornada' && <TabJornada />}
        {tab === 'reglas' && <TabReglas />}
        {tab === 'feriados' && <TabFeriados />}
      </div>
    </div>
  );
}

function TabTipos() {
  const queryClient = useQueryClient();
  const { data: tipos = [], isLoading } = useQuery({ queryKey: ['tipos-hora-extra'], queryFn: listarTiposHoraExtra });
  const [editando, setEditando] = useState<TipoHoraExtra | null>(null);
  const [nombre, setNombre] = useState('');
  const [porcentaje, setPorcentaje] = useState('');

  const guardar = useMutation({
    mutationFn: () => actualizarTipoHoraExtra(editando!.id, { nombre, porcentaje }),
    onSuccess: () => {
      setEditando(null);
      void queryClient.invalidateQueries({ queryKey: ['tipos-hora-extra'] });
    },
  });

  function iniciarEdicion(t: TipoHoraExtra) {
    setEditando(t);
    setNombre(t.nombre);
    setPorcentaje(t.porcentaje);
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="hx-table-wrap">
        <table className="hx-table">
          <thead>
            <tr>
              <th className="hx-th">Tipo de hora extra</th>
              <th className="hx-th" style={{ textAlign: 'right' }}>% de recargo</th>
              <th className="hx-th">Código</th>
              <th className="hx-th" style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <SkeletonTableRows columns={4} rows={4} align={['left', 'right', 'left', 'right']} />
            )}
            {!isLoading && tipos.map((t) => (
              <tr key={t.id} className="hx-row hx-row-in">
                {editando?.id === t.id ? (
                  <>
                    <td className="hx-td"><input className="hx-in" value={nombre} onChange={(e) => setNombre(e.target.value)} /></td>
                    <td className="hx-td" style={{ textAlign: 'right' }}><input className="hx-in tnum" style={{ textAlign: 'right' }} value={porcentaje} onChange={(e) => setPorcentaje(e.target.value)} /></td>
                    <td className="hx-td" style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}>{t.codigo}</td>
                    <td className="hx-td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--brand-strong)', cursor: guardar.isPending ? 'default' : 'pointer', marginRight: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => !guardar.isPending && guardar.mutate()}>
                        {guardar.isPending && <Spinner size={12} />} Guardar
                      </span>
                      <span style={{ color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setEditando(null)}>Cancelar</span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="hx-td" style={{ fontWeight: 600 }}>{t.nombre}</td>
                    <td className="hx-td tnum" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--brand-strong)' }}>{t.porcentaje}%</td>
                    <td className="hx-td" style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}>{t.codigo}</td>
                    <td className="hx-td" style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--brand-strong)', cursor: 'pointer', fontWeight: 600 }} onClick={() => iniciarEdicion(t)}>Editar</span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function useConfigForm(claves: string[]) {
  const { data, isLoading } = useQuery({ queryKey: ['configuracion'], queryFn: obtenerConfiguracion });
  const [form, setForm] = useState<Configuracion>({});

  useEffect(() => {
    if (data) {
      const inicial: Configuracion = {};
      for (const clave of claves) inicial[clave] = data[clave] ?? '';
      setForm(inicial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { form, setForm, isLoading };
}

function TabJornada() {
  const queryClient = useQueryClient();
  const claves = ['entrada_semana', 'salida_semana', 'entrada_sabado', 'salida_sabado', 'inicio_nocturna', 'horas_jornada', 'horas_almuerzo'];
  const { form, setForm, isLoading } = useConfigForm(claves);

  const guardar = useMutation({
    mutationFn: () => actualizarConfiguracion(form),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['configuracion'] }),
  });

  function campo(clave: string, valor: string) {
    setForm((f) => ({ ...f, [clave]: valor }));
  }

  if (isLoading) {
    return (
      <div className="hx-card" style={{ maxWidth: 720, padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i}>
            <SkeletonLine width={110} height={12} style={{ marginBottom: 8 }} />
            <SkeletonLine width="100%" height={38} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="hx-card hx-fade-in" style={{ maxWidth: 720, padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <label className="hx-label">Entrada L–V<input className="hx-in" type="time" value={form.entrada_semana ?? ''} onChange={(e) => campo('entrada_semana', e.target.value)} /></label>
      <label className="hx-label">Salida L–V<input className="hx-in" type="time" value={form.salida_semana ?? ''} onChange={(e) => campo('salida_semana', e.target.value)} /></label>
      <label className="hx-label">Entrada sábado<input className="hx-in" type="time" value={form.entrada_sabado ?? ''} onChange={(e) => campo('entrada_sabado', e.target.value)} /></label>
      <label className="hx-label">Salida sábado<input className="hx-in" type="time" value={form.salida_sabado ?? ''} onChange={(e) => campo('salida_sabado', e.target.value)} /></label>
      <label className="hx-label">Inicio jornada nocturna<input className="hx-in" type="time" value={form.inicio_nocturna ?? ''} onChange={(e) => campo('inicio_nocturna', e.target.value)} /></label>
      <label className="hx-label">Horas de jornada normal<input className="hx-in" type="number" value={form.horas_jornada ?? ''} onChange={(e) => campo('horas_jornada', e.target.value)} /></label>
      <label className="hx-label">Descuento de almuerzo (horas)<input className="hx-in" type="number" step="0.5" value={form.horas_almuerzo ?? ''} onChange={(e) => campo('horas_almuerzo', e.target.value)} /></label>
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
        <button type="button" className="hx-btn hx-btn-primary" disabled={guardar.isPending} onClick={() => guardar.mutate()}>
          {guardar.isPending && <Spinner />}
          {guardar.isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}

function TabReglas() {
  const queryClient = useQueryClient();
  const claves = ['tolerancia_minutos', 'redondeo', 'divisor_salario'];
  const { form, setForm, isLoading } = useConfigForm(claves);
  const [error, setError] = useState<string | null>(null);
  const { data: config } = useQuery({ queryKey: ['configuracion'], queryFn: obtenerConfiguracion });

  const guardar = useMutation({
    mutationFn: () => actualizarConfiguracion(form),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['configuracion'] }),
    onError: (err) => setError(mensajeError(err, 'No se pudo guardar la configuración.')),
  });

  function campo(clave: string, valor: string) {
    setForm((f) => ({ ...f, [clave]: valor }));
  }

  if (isLoading) {
    return (
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="hx-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ maxWidth: 320 }}>
              <SkeletonLine width={180} height={12} style={{ marginBottom: 8 }} />
              <SkeletonLine width="100%" height={38} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="hx-card hx-fade-in" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {error && (
          <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>
            {error}
          </div>
        )}
        <label className="hx-label" style={{ maxWidth: 320 }}>
          Minutos de tolerancia antes de contar hora extra
          <input className="hx-in" type="number" value={form.tolerancia_minutos ?? ''} onChange={(e) => campo('tolerancia_minutos', e.target.value)} />
        </label>
        <label className="hx-label" style={{ maxWidth: 320 }}>
          Redondeo de horas extra
          <select className="hx-in" value={form.redondeo ?? 'ninguno'} onChange={(e) => campo('redondeo', e.target.value)}>
            <option value="ninguno">Ninguno</option>
            <option value="quince_minutos">15 minutos</option>
            <option value="treinta_minutos">30 minutos</option>
          </select>
        </label>
        <label className="hx-label" style={{ maxWidth: 320 }}>
          Divisor de salario mensual
          <input className="hx-in tnum" type="number" step="0.01" value={form.divisor_salario ?? ''} onChange={(e) => campo('divisor_salario', e.target.value)} />
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-tertiary)' }}>Salario/hora = (salario mensual ÷ divisor) ÷ horas de jornada</span>
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="hx-btn hx-btn-primary" disabled={guardar.isPending} onClick={() => guardar.mutate()}>
            {guardar.isPending && <Spinner />}
            {guardar.isPending ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
      <ExplicacionReglas config={config} />
    </div>
  );
}

function ExplicacionReglas({ config }: { config: Configuracion | undefined }) {
  const jornada = config?.horas_jornada ?? '8';
  const almuerzo = config?.horas_almuerzo ?? '1';
  const entradaSemana = config?.entrada_semana ?? '08:30';
  const salidaSemana = config?.salida_semana ?? '17:30';
  const entradaSabado = config?.entrada_sabado ?? '09:00';
  const salidaSabado = config?.salida_sabado ?? '13:00';
  const inicioNocturna = config?.inicio_nocturna ?? '21:00';

  const reglas: { tono: 'sea' | 'coral' | 'sun'; titulo: string; texto: string }[] = [
    {
      tono: 'sea',
      titulo: 'Entre semana (lunes a viernes) — 35%',
      texto: `El horario normal es de ${entradaSemana} a ${salidaSemana} (${jornada}h de jornada, descontando ${almuerzo}h de almuerzo). Todo lo que se trabaje después de eso, sin importar la hora de entrada, se paga con 35% de recargo.`,
    },
    {
      tono: 'coral',
      titulo: 'Sábado — 100%',
      texto: `El horario normal de sábado es de ${entradaSabado} a ${salidaSabado}. Cualquier hora trabajada FUERA de ese horario —ya sea que llegó antes de ${entradaSabado} o se quedó después de ${salidaSabado}— se paga con 100% de recargo. Siempre se cuenta la hora de entrada real, nunca solo desde el horario oficial.`,
    },
    {
      tono: 'coral',
      titulo: 'Domingo — 100%',
      texto: 'No hay horario "normal" un domingo: todas las horas trabajadas ese día se pagan con 100% de recargo, desde la primera hora.',
    },
    {
      tono: 'coral',
      titulo: 'Feriado — 100%',
      texto: 'Igual que el domingo: todas las horas trabajadas en un día feriado (ver la pestaña Feriados) se pagan con 100% de recargo, sin importar el día de la semana en que caiga.',
    },
    {
      tono: 'sun',
      titulo: 'Recargo nocturno — 15% adicional',
      texto: `A partir de ${inicioNocturna}, las horas trabajadas llevan un 15% adicional, aparte de lo que ya le corresponda por el tipo de día (35%, 100% o salario normal). No reemplaza el pago del día, se suma encima.`,
    },
  ];

  return (
    <div>
      <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>Cómo se calculan las horas extra</h3>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-tertiary)' }}>
        Referencia rápida de las reglas que usa el sistema para clasificar cada hora trabajada. Los horarios y porcentajes se toman de esta pantalla de configuración.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reglas.map((r) => (
          <div key={r.titulo} className="hx-card" style={{ padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span className={`hx-badge hx-badge-${r.tono}`} style={{ flex: 'none', marginTop: 2 }}>
              {r.titulo.includes('35%') ? '35%' : r.titulo.includes('15%') ? '+15%' : '100%'}
            </span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{r.titulo}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.texto}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="hx-card" style={{ marginTop: 16, padding: '16px 18px', background: 'var(--c-sea-50)' }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Salario por hora</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Salario/hora = (salario mensual ÷ divisor de salario) ÷ horas de jornada. El divisor convierte el salario mensual a diario (estándar dominicano); dividir entre las horas de jornada da el valor por hora. Cada cálculo guarda el salario/hora y el porcentaje usados en ese momento — si cambias la configuración después, los periodos ya calculados no se alteran.
        </div>
      </div>
    </div>
  );
}

function TabFeriados() {
  const queryClient = useQueryClient();
  const anioActual = new Date().getFullYear();
  const { data: feriados = [], isLoading } = useQuery({ queryKey: ['feriados', anioActual], queryFn: () => listarFeriados(anioActual) });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const crear = useMutation({
    mutationFn: () => crearFeriado({ fecha, descripcion }),
    onSuccess: () => {
      setMostrarForm(false);
      setFecha('');
      setDescripcion('');
      void queryClient.invalidateQueries({ queryKey: ['feriados'] });
    },
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => eliminarFeriado(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['feriados'] }),
  });

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 17 }}>Feriados {anioActual}</h3>
        <button type="button" className="hx-btn hx-btn-secondary hx-btn-sm" onClick={() => setMostrarForm((v) => !v)}>
          + Agregar feriado
        </button>
      </div>
      {mostrarForm && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <input className="hx-in" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={{ maxWidth: 180 }} />
          <input className="hx-in" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <button type="button" className="hx-btn hx-btn-primary hx-btn-sm" disabled={crear.isPending} onClick={() => crear.mutate()}>
            {crear.isPending ? <Spinner size={13} /> : 'OK'}
          </button>
        </div>
      )}
      <div className="hx-card" style={{ overflow: 'hidden' }}>
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
            <span className="hx-skel" style={{ width: 44, height: 44, borderRadius: 10 }} />
            <div style={{ flex: 1 }}>
              <SkeletonLine width="40%" height={13} style={{ marginBottom: 6 }} />
              <SkeletonLine width="25%" height={10} />
            </div>
          </div>
        ))}
        {!isLoading && feriados.map((h) => {
          const [, mes, dia] = h.fecha.split('-').map(Number);
          const weekday = new Date(h.fecha + 'T00:00:00').toLocaleDateString('es-DO', { weekday: 'long' });
          return (
            <div key={h.id} className="hx-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--c-sun-50)', color: 'var(--c-sun-600)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <span className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>{String(dia).padStart(2, '0')}</span>
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{MESES[mes - 1]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{h.descripcion}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{weekday}</div>
              </div>
              <span style={{ color: 'var(--c-danger)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }} onClick={() => eliminar.mutate(h.id)}>Eliminar</span>
            </div>
          );
        })}
        {!isLoading && feriados.length === 0 && <div className="hx-empty">Sin feriados registrados para {anioActual}.</div>}
      </div>
    </div>
  );
}
