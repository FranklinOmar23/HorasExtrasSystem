import { EstadoPeriodo } from '../enums/estado-periodo.enum';
export declare class Periodo {
    readonly id: string;
    readonly fechaInicio: Date;
    readonly fechaFin: Date;
    readonly estado: EstadoPeriodo;
    readonly cerradoEn: Date | null;
    readonly cerradoPorId: string | null;
    constructor(id: string, fechaInicio: Date, fechaFin: Date, estado: EstadoPeriodo, cerradoEn: Date | null, cerradoPorId: string | null);
    estaCerrado(): boolean;
}
