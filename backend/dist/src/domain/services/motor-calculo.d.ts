import Decimal from 'decimal.js';
import { TipoHoraExtra } from '../entities/tipo-hora-extra.entity';
import { TipoHoraExtraCodigo } from '../enums/tipo-hora-extra-codigo.enum';
export interface ParametrosCalculo {
    horasJornada: Decimal;
    horasAlmuerzo: Decimal;
    entradaSabado: string;
    salidaSabado: string;
    inicioNocturna: string;
    toleranciaMinutos: number;
}
export interface EntradaMotorCalculo {
    fecha: Date;
    horaEntrada: string;
    horaSalida: string;
    esFeriado: boolean;
    salarioHoraUsado: Decimal;
}
export interface FilaCalculo {
    tipoHoraId: string;
    tipoHoraCodigo: TipoHoraExtraCodigo;
    cantidadHoras: Decimal;
    porcentajeAplicado: Decimal;
    salarioHoraUsado: Decimal;
    monto: Decimal;
}
export declare class MotorCalculo {
    private readonly tiposHoraExtra;
    constructor(tiposHoraExtra: TipoHoraExtra[]);
    calcular(entrada: EntradaMotorCalculo, parametros: ParametrosCalculo): FilaCalculo[];
    private buscarTipo;
    private agregarFila;
}
