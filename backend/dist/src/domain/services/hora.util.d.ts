export declare function parsearHora(horaHHmm: string): number;
export declare function entradaSalidaAjustadas(horaEntrada: string, horaSalida: string): {
    entrada: number;
    salida: number;
};
export declare function duracionMinutos(horaInicio: string, horaFin: string): number;
export declare function minutosDesdeReferencia(entrada: number, salida: number, horaReferencia: string): number;
