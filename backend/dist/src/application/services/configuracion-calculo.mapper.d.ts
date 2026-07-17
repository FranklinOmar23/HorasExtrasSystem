import Decimal from 'decimal.js';
import { ParametrosCalculo } from '../../domain/services/motor-calculo';
export interface ConfiguracionCalculoParseada {
    divisorSalario: Decimal;
    parametrosMotor: ParametrosCalculo;
}
export declare function parsearConfiguracionCalculo(configuracion: Record<string, string>): ConfiguracionCalculoParseada;
