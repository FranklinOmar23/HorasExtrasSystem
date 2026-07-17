import { Periodo } from '../../domain/entities/periodo.entity';
export declare const PERIODO_REPOSITORY: unique symbol;
export interface CrearPeriodoDatos {
    fechaInicio: Date;
    fechaFin: Date;
}
export interface PeriodoRepository {
    listar(): Promise<Periodo[]>;
    buscarPorId(id: string): Promise<Periodo | null>;
    buscarPorFechas(fechaInicio: Date, fechaFin: Date): Promise<Periodo | null>;
    crear(datos: CrearPeriodoDatos): Promise<Periodo>;
    cerrar(id: string, cerradoPorId: string, cerradoEn: Date): Promise<Periodo>;
}
