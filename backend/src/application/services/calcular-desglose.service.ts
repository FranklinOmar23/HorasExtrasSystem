import { ResolverTurnoDelEmpleadoUseCase } from '../use-cases/asignaciones-turno/resolver-turno-del-empleado.use-case';
import { SalarioNoVigenteError } from '../../domain/errors/salario-no-vigente.error';
import { FilaCalculo, MotorCalculo } from '../../domain/services/motor-calculo';
import { ConfiguracionRepository } from '../ports/configuracion.repository.port';
import { FeriadoRepository } from '../ports/feriado.repository.port';
import { SalarioRepository } from '../ports/salario.repository.port';
import { TipoHoraExtraRepository } from '../ports/tipo-hora-extra.repository.port';
import { parsearConfiguracionCalculo } from './configuracion-calculo.mapper';

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

function diaSiguiente(fecha: Date): Date {
  const siguiente = new Date(fecha);
  siguiente.setUTCDate(siguiente.getUTCDate() + 1);
  return siguiente;
}

/**
 * Orquesta la resolución de todo lo que el motor de cálculo (puro) necesita
 * —salario vigente, turno vigente del empleado, si la fecha (y la
 * siguiente, por si el trabajo cruza medianoche) es feriado, parámetros de
 * configuración y catálogo de tipos de hora extra— y ejecuta el cálculo.
 * Usado por los casos de uso de crear/actualizar/preview de registros para
 * no duplicar esta orquestación tres veces.
 */
export class CalcularDesgloseService {
  constructor(
    private readonly salarioRepository: SalarioRepository,
    private readonly feriadoRepository: FeriadoRepository,
    private readonly configuracionRepository: ConfiguracionRepository,
    private readonly tipoHoraExtraRepository: TipoHoraExtraRepository,
    private readonly resolverTurno: ResolverTurnoDelEmpleadoUseCase,
  ) {}

  async calcular(
    empleadoId: string,
    fecha: Date,
    horaEntrada: string,
    horaSalida: string,
  ): Promise<FilaCalculo[]> {
    const [
      salario,
      feriadoDiaEntrada,
      feriadoDiaSiguiente,
      configuracionCruda,
      tiposHoraExtra,
      resolucionTurno,
    ] = await Promise.all([
      this.salarioRepository.buscarVigenteEn(empleadoId, fecha),
      this.feriadoRepository.buscarPorFecha(fecha),
      this.feriadoRepository.buscarPorFecha(diaSiguiente(fecha)),
      this.configuracionRepository.obtenerTodos(),
      this.tipoHoraExtraRepository.listar(),
      this.resolverTurno.ejecutar(empleadoId, fecha),
    ]);

    if (!salario) {
      throw new SalarioNoVigenteError(empleadoId, aFechaISO(fecha));
    }

    const { divisorSalario, horasJornadaGlobal, parametrosMotor } =
      parsearConfiguracionCalculo(configuracionCruda);
    // divisorSalario (23.83) convierte el salario mensual a DIARIO (es el
    // estándar dominicano de días hábiles promedio por mes); hay que dividir
    // ese diario entre las horas de la jornada para llegar al salario/hora.
    // Este divisor es global (no depende del turno del empleado ese día).
    const salarioHoraUsado = salario.montoMensual
      .dividedBy(divisorSalario)
      .dividedBy(horasJornadaGlobal);

    const motor = new MotorCalculo(tiposHoraExtra);
    return motor.calcular(
      {
        fecha,
        horaEntrada,
        horaSalida,
        turno: {
          horaInicio: resolucionTurno.turno.horaInicio,
          horaFin: resolucionTurno.turno.horaFin,
          cruzaMedianoche: resolucionTurno.turno.cruzaMedianoche,
          horasJornada: resolucionTurno.turno.horasJornada,
          descuentaAlmuerzo: resolucionTurno.turno.descuentaAlmuerzo,
        },
        turnoAsignadoExplicitamente: resolucionTurno.explicita,
        esFeriadoDiaEntrada: feriadoDiaEntrada !== null,
        esFeriadoDiaSiguiente: feriadoDiaSiguiente !== null,
        salarioHoraUsado,
      },
      parametrosMotor,
    );
  }
}
