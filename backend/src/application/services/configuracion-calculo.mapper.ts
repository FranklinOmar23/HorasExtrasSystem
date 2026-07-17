import Decimal from 'decimal.js';
import { ParametrosCalculo } from '../../domain/services/motor-calculo';

export interface ConfiguracionCalculoParseada {
  divisorSalario: Decimal;
  parametrosMotor: ParametrosCalculo;
}

/** Convierte el mapa clave-valor de `configuracion` a los tipos que espera el motor de cálculo. */
export function parsearConfiguracionCalculo(
  configuracion: Record<string, string>,
): ConfiguracionCalculoParseada {
  return {
    divisorSalario: new Decimal(configuracion.divisor_salario),
    parametrosMotor: {
      horasJornada: new Decimal(configuracion.horas_jornada),
      horasAlmuerzo: new Decimal(configuracion.horas_almuerzo),
      entradaSabado: configuracion.entrada_sabado,
      salidaSabado: configuracion.salida_sabado,
      inicioNocturna: configuracion.inicio_nocturna,
      toleranciaMinutos: Number(configuracion.tolerancia_minutos),
    },
  };
}
