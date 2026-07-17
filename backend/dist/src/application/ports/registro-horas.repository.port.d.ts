import { Calculo } from '../../domain/entities/calculo.entity';
import { RegistroHoras } from '../../domain/entities/registro-horas.entity';
import { OrigenRegistro } from '../../domain/enums/origen-registro.enum';
import { FilaCalculo } from '../../domain/services/motor-calculo';
export declare const REGISTRO_HORAS_REPOSITORY: unique symbol;
export interface RegistroConCalculos {
    registro: RegistroHoras;
    calculos: Calculo[];
}
export interface CrearRegistroDatos {
    periodoId: string;
    empleadoId: string;
    fecha: Date;
    horaEntrada: string;
    horaSalida: string;
    origen: OrigenRegistro;
    importacionId: string | null;
    comentario: string | null;
}
export interface ActualizarRegistroDatos {
    fecha: Date;
    horaEntrada: string;
    horaSalida: string;
    comentario: string | null;
}
export interface RegistroHorasRepository {
    listarPorPeriodo(periodoId: string, empleadoId?: string): Promise<RegistroConCalculos[]>;
    buscarPorId(id: string): Promise<RegistroConCalculos | null>;
    crear(datos: CrearRegistroDatos, filas: FilaCalculo[]): Promise<RegistroConCalculos>;
    actualizar(id: string, datos: ActualizarRegistroDatos, filas: FilaCalculo[]): Promise<RegistroConCalculos>;
    eliminar(id: string): Promise<void>;
}
