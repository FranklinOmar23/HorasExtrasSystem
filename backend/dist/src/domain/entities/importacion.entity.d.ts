export declare class Importacion {
    readonly id: string;
    readonly periodoId: string;
    readonly usuarioId: string;
    readonly archivo: string;
    readonly filasOk: number;
    readonly filasAdvertencia: number;
    readonly filasError: number;
    readonly importadoEn: Date;
    readonly confirmadaEn: Date | null;
    constructor(id: string, periodoId: string, usuarioId: string, archivo: string, filasOk: number, filasAdvertencia: number, filasError: number, importadoEn: Date, confirmadaEn: Date | null);
    estaConfirmada(): boolean;
}
