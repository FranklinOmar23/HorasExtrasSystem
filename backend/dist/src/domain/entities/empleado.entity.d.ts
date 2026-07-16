export declare class Empleado {
    readonly id: string;
    readonly codigo: string;
    readonly nombre: string;
    readonly cargo: string | null;
    readonly activo: boolean;
    constructor(id: string, codigo: string, nombre: string, cargo: string | null, activo: boolean);
}
