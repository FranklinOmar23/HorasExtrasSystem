import { Fragment, useState } from 'react';
import { crearEmpleado } from '../api/empleados';
import { mensajeError } from '../api/client';
import type { Empleado } from '../types/api';
import { Spinner } from './Spinner';

export interface EmpleadoNuevoPendiente {
  codigo: number;
  nombreSugerido: string;
  /** Fecha más antigua en la que aparece este código en el archivo, para
   *  sugerir un "vigente desde" que cubra todas sus filas. */
  fechaMasTemprana: string | null;
}

type EstadoFila = 'pendiente' | 'omitido' | 'guardado';

interface FilaFormulario {
  /** Identificador estable de la fila en este formulario (no es el código:
   *  el código sí se puede editar, ej. para poner el código real del ponche
   *  si el que trae el Excel no es el correcto). */
  idInterno: number;
  codigo: string;
  nombre: string;
  posicion: string;
  montoMensual: string;
  vigenteDesde: string;
  estado: EstadoFila;
  error: string | null;
}

function filaValida(f: FilaFormulario): boolean {
  return (
    Number.isInteger(Number(f.codigo)) &&
    Number(f.codigo) > 0 &&
    f.nombre.trim() !== '' &&
    f.posicion.trim() !== '' &&
    Number(f.montoMensual) > 0 &&
    f.vigenteDesde !== ''
  );
}

export function EmpleadosNuevosModal({
  pendientes,
  vigenteDesdePorDefecto,
  onListo,
  onCerrar,
}: {
  pendientes: EmpleadoNuevoPendiente[];
  vigenteDesdePorDefecto: string;
  onListo: (creados: Empleado[]) => void;
  onCerrar: () => void;
}) {
  const [filas, setFilas] = useState<FilaFormulario[]>(() =>
    pendientes.map((p, i) => ({
      idInterno: i,
      codigo: String(p.codigo),
      nombre: p.nombreSugerido,
      posicion: '',
      montoMensual: '',
      vigenteDesde: p.fechaMasTemprana ?? vigenteDesdePorDefecto,
      estado: 'pendiente' as EstadoFila,
      error: null,
    })),
  );
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  function actualizarFila(idInterno: number, cambios: Partial<FilaFormulario>) {
    setFilas((actual) => actual.map((f) => (f.idInterno === idInterno ? { ...f, ...cambios } : f)));
  }

  function alternarOmitir(idInterno: number) {
    setFilas((actual) =>
      actual.map((f) =>
        f.idInterno === idInterno
          ? { ...f, estado: f.estado === 'omitido' ? 'pendiente' : 'omitido', error: null }
          : f,
      ),
    );
  }

  const pendientesActuales = filas.filter((f) => f.estado === 'pendiente');
  const puedeGuardar = pendientesActuales.length > 0 && pendientesActuales.every(filaValida);

  async function guardarTodos() {
    setEnviando(true);
    setErrorGeneral(null);

    const resultados = await Promise.allSettled(
      pendientesActuales.map((f) =>
        crearEmpleado({
          codigo: Number(f.codigo),
          nombre: f.nombre.trim(),
          posicion: f.posicion.trim(),
          salarioInicial: { montoMensual: f.montoMensual, vigenteDesde: f.vigenteDesde },
        }),
      ),
    );

    const creados: Empleado[] = [];
    let huboError = false;
    setFilas((actual) => {
      const nuevas = [...actual];
      resultados.forEach((r, i) => {
        const idInterno = pendientesActuales[i].idInterno;
        const idx = nuevas.findIndex((f) => f.idInterno === idInterno);
        if (idx === -1) return;
        if (r.status === 'fulfilled') {
          creados.push(r.value);
          nuevas[idx] = { ...nuevas[idx], estado: 'guardado', error: null };
        } else {
          huboError = true;
          nuevas[idx] = { ...nuevas[idx], error: mensajeError(r.reason, 'No se pudo guardar.') };
        }
      });
      return nuevas;
    });

    setEnviando(false);

    if (huboError) {
      setErrorGeneral('Algunos empleados no se pudieron guardar — revisa los que tienen error abajo y vuelve a intentar.');
      return;
    }

    onListo(creados);
  }

  const totalPendientes = filas.filter((f) => f.estado === 'pendiente').length;

  return (
    <div className="hx-overlay">
      <div className="hx-modal" style={{ maxWidth: 820, width: '92vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div className="hx-eyebrow">{filas.length} empleado{filas.length === 1 ? '' : 's'} nuevo{filas.length === 1 ? '' : 's'} detectado{filas.length === 1 ? '' : 's'}</div>
          <span onClick={onCerrar} style={{ cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>Estos códigos no existen en el sistema</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0 0 18px', fontSize: 13.5, lineHeight: 1.55 }}>
          Se encontraron en el Excel pero no están registrados. Revisa/corrige el código (ej. el código real del
          ponche) y completa la posición y el salario de cada uno para darlos de alta e incluirlos en esta
          importación. La fecha "vigente desde" ya se sugirió con la fecha más antigua en la que aparece cada
          código en el archivo.
        </p>

        {errorGeneral && (
          <div style={{ background: 'var(--c-danger-bg)', color: 'var(--c-danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 14 }}>
            {errorGeneral}
          </div>
        )}

        <div className="hx-table-wrap" style={{ maxHeight: 420, overflowY: 'auto', marginBottom: 18 }}>
          <table className="hx-table">
            <thead>
              <tr>
                <th className="hx-th">Código</th>
                <th className="hx-th">Nombre</th>
                <th className="hx-th">Posición</th>
                <th className="hx-th">Salario mensual (RD$)</th>
                <th className="hx-th">Vigente desde</th>
                <th className="hx-th" style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => {
                const deshabilitada = f.estado !== 'pendiente';
                return (
                  <Fragment key={f.idInterno}>
                  <tr className="hx-row" style={f.estado === 'guardado' ? { opacity: 0.55 } : f.estado === 'omitido' ? { opacity: 0.4 } : undefined}>
                    <td className="hx-td">
                      <input
                        className="hx-in tnum"
                        type="number"
                        value={f.codigo}
                        disabled={deshabilitada}
                        onChange={(e) => actualizarFila(f.idInterno, { codigo: e.target.value })}
                        style={{ minWidth: 90 }}
                      />
                    </td>
                    <td className="hx-td">
                      <input
                        className="hx-in"
                        value={f.nombre}
                        disabled={deshabilitada}
                        onChange={(e) => actualizarFila(f.idInterno, { nombre: e.target.value })}
                        style={{ minWidth: 160 }}
                      />
                    </td>
                    <td className="hx-td">
                      <input
                        className="hx-in"
                        placeholder="Ej. Operario"
                        value={f.posicion}
                        disabled={deshabilitada}
                        onChange={(e) => actualizarFila(f.idInterno, { posicion: e.target.value })}
                        style={{ minWidth: 130 }}
                      />
                    </td>
                    <td className="hx-td">
                      <input
                        className="hx-in tnum"
                        placeholder="27000.00"
                        value={f.montoMensual}
                        disabled={deshabilitada}
                        onChange={(e) => actualizarFila(f.idInterno, { montoMensual: e.target.value })}
                        style={{ minWidth: 110 }}
                      />
                    </td>
                    <td className="hx-td">
                      <input
                        className="hx-in"
                        type="date"
                        value={f.vigenteDesde}
                        disabled={deshabilitada}
                        onChange={(e) => actualizarFila(f.idInterno, { vigenteDesde: e.target.value })}
                      />
                    </td>
                    <td className="hx-td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {f.estado === 'guardado' && <span className="hx-badge hx-badge-success">✓ Guardado</span>}
                      {f.estado === 'omitido' && (
                        <span onClick={() => alternarOmitir(f.idInterno)} style={{ color: 'var(--brand-strong)', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>
                          Deshacer
                        </span>
                      )}
                      {f.estado === 'pendiente' && (
                        <span onClick={() => alternarOmitir(f.idInterno)} style={{ color: 'var(--c-danger)', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>
                          Omitir
                        </span>
                      )}
                    </td>
                  </tr>
                  {f.error && (
                    <tr>
                      <td className="hx-td" colSpan={6} style={{ color: 'var(--c-danger)', fontSize: 12.5, paddingTop: 0, borderTop: 'none' }}>
                        {f.error}
                      </td>
                    </tr>
                  )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>
            {totalPendientes} de {filas.length} por completar
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="hx-btn hx-btn-secondary" onClick={onCerrar} disabled={enviando}>
              Cancelar importación
            </button>
            <button
              type="button"
              className="hx-btn hx-btn-primary"
              disabled={!puedeGuardar || enviando}
              onClick={guardarTodos}
            >
              {enviando && <Spinner />}
              {enviando ? 'Guardando…' : 'Guardar todos y continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
