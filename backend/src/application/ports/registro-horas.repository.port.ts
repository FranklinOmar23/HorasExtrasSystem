import { Calculo } from '../../domain/entities/calculo.entity';
import { RegistroHoras } from '../../domain/entities/registro-horas.entity';
import { OrigenRegistro } from '../../domain/enums/origen-registro.enum';
import { FilaCalculo } from '../../domain/services/motor-calculo';

export const REGISTRO_HORAS_REPOSITORY = Symbol('REGISTRO_HORAS_REPOSITORY');

export interface RegistroConCalculos {
  registro: RegistroHoras;
  calculos: Calculo[];
}

export interface CrearRegistroDatos {
  periodoId: string;
  empleadoId: string;
  fecha: Date;
  horaEntrada: string;
  horaSalida: string;
  origen: OrigenRegistro;
  importacionId: string | null;
  comentario: string | null;
}

export interface ActualizarRegistroDatos {
  fecha: Date;
  horaEntrada: string;
  horaSalida: string;
  comentario: string | null;
}

export interface RegistroHorasRepository {
  listarPorPeriodo(
    periodoId: string,
    empleadoId?: string,
  ): Promise<RegistroConCalculos[]>;
  /** Registros de un empleado en un rango de fechas, sin importar el periodo
   *  al que pertenezcan. `hasta` null = sin límite superior. Usado para
   *  recalcular los `calculos` afectados al crear/editar/borrar una
   *  asignación de turno. */
  listarPorEmpleadoYRango(
    empleadoId: string,
    desde: Date,
    hasta: Date | null,
  ): Promise<RegistroConCalculos[]>;
  buscarPorId(id: string): Promise<RegistroConCalculos | null>;
  crear(
    datos: CrearRegistroDatos,
    filas: FilaCalculo[],
  ): Promise<RegistroConCalculos>;
  /** Reemplaza los datos del registro y regenera por completo sus `calculos`. */
  actualizar(
    id: string,
    datos: ActualizarRegistroDatos,
    filas: FilaCalculo[],
  ): Promise<RegistroConCalculos>;
  eliminar(id: string): Promise<void>;
}
