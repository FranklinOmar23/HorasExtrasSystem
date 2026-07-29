import Decimal from 'decimal.js';
import { ParametrosCalculo } from '../../domain/services/motor-calculo';

export interface ConfiguracionCalculoParseada {
  divisorSalario: Decimal;
  /** Para el salario/hora (montoMensual / divisorSalario / horasJornadaGlobal); no es la ventana de ningún turno. */
  horasJornadaGlobal: Decimal;
  parametrosMotor: ParametrosCalculo;
}

const MINUTOS_POR_CLAVE_REDONDEO: Record<string, number> = {
  ninguno: 0,
  quince_minutos: 15,
  treinta_minutos: 30,
};

/** 0 (sin redondeo) para cualquier clave desconocida o no configurada. */
function redondeoMinutosDesdeConfig(clave: string | undefined): number {
  return clave !== undefined ? (MINUTOS_POR_CLAVE_REDONDEO[clave] ?? 0) : 0;
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
      redondeoMinutos: redondeoMinutosDesdeConfig(configuracion.redondeo),
    },
  };
}
