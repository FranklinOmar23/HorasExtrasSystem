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

/**
 * Orquesta la resolución de todo lo que el motor de cálculo (puro) necesita
 * —salario vigente, si la fecha es feriado, parámetros de configuración y
 * catálogo de tipos de hora extra— y ejecuta el cálculo. Usado por los casos
 * de uso de crear/actualizar/preview de registros para no duplicar esta
 * orquestación tres veces.
 */
export class CalcularDesgloseService {
  constructor(
    private readonly salarioRepository: SalarioRepository,
    private readonly feriadoRepository: FeriadoRepository,
    private readonly configuracionRepository: ConfiguracionRepository,
    private readonly tipoHoraExtraRepository: TipoHoraExtraRepository,
  ) {}

  async calcular(
    empleadoId: string,
    fecha: Date,
    horaEntrada: string,
    horaSalida: string,
  ): Promise<FilaCalculo[]> {
    const [salario, feriado, configuracionCruda, tiposHoraExtra] =
      await Promise.all([
        this.salarioRepository.buscarVigenteEn(empleadoId, fecha),
        this.feriadoRepository.buscarPorFecha(fecha),
        this.configuracionRepository.obtenerTodos(),
        this.tipoHoraExtraRepository.listar(),
      ]);

    if (!salario) {
      throw new SalarioNoVigenteError(empleadoId, aFechaISO(fecha));
    }

    const { divisorSalario, parametrosMotor } =
      parsearConfiguracionCalculo(configuracionCruda);
    // divisorSalario (23.83) convierte el salario mensual a DIARIO (es el
    // estándar dominicano de días hábiles promedio por mes); hay que dividir
    // ese diario entre las horas de la jornada para llegar al salario/hora.
    const salarioHoraUsado = salario.montoMensual
      .dividedBy(divisorSalario)
      .dividedBy(parametrosMotor.horasJornada);

    const motor = new MotorCalculo(tiposHoraExtra);
    return motor.calcular(
      {
        fecha,
        horaEntrada,
        horaSalida,
        esFeriado: feriado !== null,
        salarioHoraUsado,
      },
      parametrosMotor,
    );
  }
}
