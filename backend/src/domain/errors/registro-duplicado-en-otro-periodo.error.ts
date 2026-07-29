import { DomainError } from './domain.error';

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

/** Evita pagar dos veces la misma jornada: un registro retroactivo no puede
 *  crearse si ya existe un registro del mismo empleado en esa fecha real en
 *  cualquier otro periodo (incluidos cerrados). */
export class RegistroDuplicadoEnOtroPeriodoError extends DomainError {
  readonly code = 'REGISTRO_DUPLICADO_EN_OTRO_PERIODO';
  readonly httpStatus = 409;

  constructor(
    empleadoId: string,
    fecha: Date,
    periodoExistenteId: string,
    periodoExistenteFechaInicio: Date,
    periodoExistenteFechaFin: Date,
  ) {
    super(
      `Ya existe un registro del empleado ${empleadoId} para la fecha ${aFechaISO(fecha)} ` +
        `en el periodo ${aFechaISO(periodoExistenteFechaInicio)} – ${aFechaISO(periodoExistenteFechaFin)} ` +
        `(id ${periodoExistenteId}). No se puede pagar la misma jornada dos veces.`,
    );
  }
}
