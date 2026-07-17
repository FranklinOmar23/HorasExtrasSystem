import { Periodo } from '../../domain/entities/periodo.entity';
import { EstadoFilaImportacion } from '../../domain/enums/estado-fila-importacion.enum';
import { entradaSalidaAjustadas } from '../../domain/services/hora.util';
import { FilaExcelCruda } from '../ports/excel-parser.port';
import { EmpleadoRepository } from '../ports/empleado.repository.port';
import { RegistroHorasRepository } from '../ports/registro-horas.repository.port';
import { SalarioRepository } from '../ports/salario.repository.port';

/**
 * Turnos que cruzan medianoche con una duración mayor a esto se consideran
 * un probable error de captura (ej. AM/PM invertido) y se marcan como
 * advertencia en vez de aceptarse silenciosamente como un turno nocturno real.
 */
const MAX_HORAS_TURNO_RAZONABLE = 12;

export interface FilaImportacionValidada {
  linea: number;
  fecha: Date | null;
  codigo: number | null;
  nombre: string | null;
  horaEntrada: string | null;
  horaSalida: string | null;
  /** Id del empleado resuelto por código; null si no se pudo resolver. */
  empleadoId: string | null;
  estado: EstadoFilaImportacion;
  mensajes: string[];
}

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

function agravar(
  actual: EstadoFilaImportacion,
  nuevo: EstadoFilaImportacion,
): EstadoFilaImportacion {
  const severidad = {
    [EstadoFilaImportacion.OK]: 0,
    [EstadoFilaImportacion.ADVERTENCIA]: 1,
    [EstadoFilaImportacion.ERROR]: 2,
  };
  return severidad[nuevo] > severidad[actual] ? nuevo : actual;
}

/**
 * Aplica las reglas de validación de una importación (código inexistente o
 * inactivo, sin salario vigente, fecha fuera del periodo, duplicados, cruce
 * de medianoche poco razonable, horas vacías) sobre las filas ya parseadas
 * del Excel. No persiste nada: solo clasifica cada fila como OK/ADVERTENCIA/
 * ERROR con sus mensajes, para la vista previa y para decidir qué persistir
 * al confirmar.
 */
export class ValidarFilasImportacionService {
  constructor(
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly salarioRepository: SalarioRepository,
    private readonly registroHorasRepository: RegistroHorasRepository,
  ) {}

  async validar(
    filas: FilaExcelCruda[],
    periodo: Periodo,
  ): Promise<FilaImportacionValidada[]> {
    const registrosExistentes =
      await this.registroHorasRepository.listarPorPeriodo(periodo.id);
    const clavesExistentes = new Set(
      registrosExistentes.map(
        (r) => `${r.registro.empleadoId}|${aFechaISO(r.registro.fecha)}`,
      ),
    );
    const clavesVistasEnArchivo = new Set<string>();

    const resultado: FilaImportacionValidada[] = [];
    for (const filaCruda of filas) {
      resultado.push(
        await this.validarFila(
          filaCruda,
          periodo,
          clavesExistentes,
          clavesVistasEnArchivo,
        ),
      );
    }
    return resultado;
  }

  private async validarFila(
    filaCruda: FilaExcelCruda,
    periodo: Periodo,
    clavesExistentes: Set<string>,
    clavesVistasEnArchivo: Set<string>,
  ): Promise<FilaImportacionValidada> {
    const base = {
      linea: filaCruda.linea,
      fecha: filaCruda.fecha,
      codigo: filaCruda.codigo,
      nombre: filaCruda.nombreCrudo,
      horaEntrada: filaCruda.horaEntrada,
      horaSalida: filaCruda.horaSalida,
      empleadoId: null as string | null,
    };

    if (!filaCruda.horaEntrada || !filaCruda.horaSalida) {
      return {
        ...base,
        estado: EstadoFilaImportacion.ERROR,
        mensajes: ['Fila ignorada: hora de entrada o salida vacía.'],
      };
    }

    let estado = EstadoFilaImportacion.OK;
    const mensajes: string[] = [];
    let empleadoId: string | null = null;
    let nombre = filaCruda.nombreCrudo;

    if (filaCruda.fecha === null) {
      estado = agravar(estado, EstadoFilaImportacion.ERROR);
      mensajes.push('Fecha vacía o con formato no reconocido.');
    }

    if (filaCruda.codigo === null) {
      estado = agravar(estado, EstadoFilaImportacion.ERROR);
      mensajes.push('Código de empleado vacío o inválido.');
    } else {
      const empleado = await this.empleadoRepository.buscarPorCodigo(
        filaCruda.codigo,
      );
      if (!empleado) {
        estado = agravar(estado, EstadoFilaImportacion.ERROR);
        mensajes.push(`No existe un empleado con código ${filaCruda.codigo}.`);
      } else if (!empleado.activo) {
        estado = agravar(estado, EstadoFilaImportacion.ERROR);
        mensajes.push(
          `El empleado con código ${filaCruda.codigo} está inactivo.`,
        );
      } else {
        empleadoId = empleado.id;
        nombre = empleado.nombre;
        if (filaCruda.fecha !== null) {
          const salario = await this.salarioRepository.buscarVigenteEn(
            empleado.id,
            filaCruda.fecha,
          );
          if (!salario) {
            estado = agravar(estado, EstadoFilaImportacion.ERROR);
            mensajes.push(
              'El empleado no tiene salario vigente en esta fecha.',
            );
          }
        }
      }
    }

    if (filaCruda.fecha !== null) {
      if (
        filaCruda.fecha < periodo.fechaInicio ||
        filaCruda.fecha > periodo.fechaFin
      ) {
        estado = agravar(estado, EstadoFilaImportacion.ADVERTENCIA);
        mensajes.push('La fecha está fuera del rango del periodo.');
      }
    }

    const { entrada, salida } = entradaSalidaAjustadas(
      filaCruda.horaEntrada,
      filaCruda.horaSalida,
    );
    const cruzaMedianoche =
      salida !== entrada && filaCruda.horaSalida < filaCruda.horaEntrada;
    if (cruzaMedianoche) {
      const duracionHoras = (salida - entrada) / 60;
      if (duracionHoras > MAX_HORAS_TURNO_RAZONABLE) {
        estado = agravar(estado, EstadoFilaImportacion.ADVERTENCIA);
        mensajes.push(
          `Cruce de medianoche inusual: turno de ${duracionHoras}h, verifique los datos.`,
        );
      }
    }

    if (empleadoId !== null && filaCruda.fecha !== null) {
      const clave = `${empleadoId}|${aFechaISO(filaCruda.fecha)}`;
      if (clavesExistentes.has(clave)) {
        estado = agravar(estado, EstadoFilaImportacion.ADVERTENCIA);
        mensajes.push(
          'Ya existe un registro para este empleado en esta fecha.',
        );
      } else if (clavesVistasEnArchivo.has(clave)) {
        estado = agravar(estado, EstadoFilaImportacion.ADVERTENCIA);
        mensajes.push(
          'Fila duplicada dentro del archivo para este empleado y fecha.',
        );
      } else {
        clavesVistasEnArchivo.add(clave);
      }
    }

    return { ...base, nombre, empleadoId, estado, mensajes };
  }
}
