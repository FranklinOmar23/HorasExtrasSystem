import { Feriado } from '../../domain/entities/feriado.entity';
export declare const FERIADO_REPOSITORY: unique symbol;
export interface CrearFeriadoDatos {
    fecha: Date;
    descripcion: string;
}
export interface FeriadoRepository {
    listar(anio?: number): Promise<Feriado[]>;
    buscarPorId(id: string): Promise<Feriado | null>;
    buscarPorFecha(fecha: Date): Promise<Feriado | null>;
    crear(datos: CrearFeriadoDatos): Promise<Feriado>;
    eliminar(id: string): Promise<void>;
}
