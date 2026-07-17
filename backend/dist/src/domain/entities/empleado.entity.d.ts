export declare class Empleado {
    readonly id: string;
    readonly codigo: number;
    readonly nombre: string;
    readonly cedula: string | null;
    readonly posicion: string;
    readonly activo: boolean;
    constructor(id: string, codigo: number, nombre: string, cedula: string | null, posicion: string, activo: boolean);
}
