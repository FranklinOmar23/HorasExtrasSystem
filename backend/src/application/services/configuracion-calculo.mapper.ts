import Decimal from 'decimal.js';
import { ParametrosCalculo } from '../../domain/services/motor-calculo';

export interface ConfiguracionCalculoParseada {
  divisorSalario: Decimal;
  /** Para el salario/hora (montoMensual / divisorSalario / horasJornadaGlobal); no es la ventana de ningún turno. */
  horasJornadaGlobal: Decimal;
  parametrosMotor: ParametrosCalculo;
}

/** Convierte el mapa clave-valor de `configuracion` a los tipos que espera el motor de cálculo. */
export function parsearConfiguracionCalculo(
  configuracion: Record<string, string>,
): ConfiguracionCalculoParseada {
  return {
    divisorSalario: new Decimal(configuracion.divisor_salario),
    horasJornadaGlobal: new Decimal(configuracion.horas_jornada),
    parametrosMotor: {
      horasAlmuerzo: new Decimal(configuracion.horas_almuerzo),
      inicioNocturna: configuracion.inicio_nocturna,
      finNocturna: configuracion.fin_nocturna,
      toleranciaMinutos: Number(configuracion.tolerancia_minutos),
    },
  };
}
