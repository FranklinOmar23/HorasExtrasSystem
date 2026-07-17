"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidarFilasImportacionService = void 0;
const estado_fila_importacion_enum_1 = require("../../domain/enums/estado-fila-importacion.enum");
const hora_util_1 = require("../../domain/services/hora.util");
const MAX_HORAS_TURNO_RAZONABLE = 12;
function aFechaISO(fecha) {
    return fecha.toISOString().slice(0, 10);
}
function agravar(actual, nuevo) {
    const severidad = {
        [estado_fila_importacion_enum_1.EstadoFilaImportacion.OK]: 0,
        [estado_fila_importacion_enum_1.EstadoFilaImportacion.ADVERTENCIA]: 1,
        [estado_fila_importacion_enum_1.EstadoFilaImportacion.ERROR]: 2,
    };
    return severidad[nuevo] > severidad[actual] ? nuevo : actual;
}
class ValidarFilasImportacionService {
    empleadoRepository;
    salarioRepository;
    registroHorasRepository;
    constructor(empleadoRepository, salarioRepository, registroHorasRepository) {
        this.empleadoRepository = empleadoRepository;
        this.salarioRepository = salarioRepository;
        this.registroHorasRepository = registroHorasRepository;
    }
    async validar(filas, periodo) {
        const registrosExistentes = await this.registroHorasRepository.listarPorPeriodo(periodo.id);
        const clavesExistentes = new Set(registrosExistentes.map((r) => `${r.registro.empleadoId}|${aFechaISO(r.registro.fecha)}`));
        const clavesVistasEnArchivo = new Set();
        const resultado = [];
        for (const filaCruda of filas) {
            resultado.push(await this.validarFila(filaCruda, periodo, clavesExistentes, clavesVistasEnArchivo));
        }
        return resultado;
    }
    async validarFila(filaCruda, periodo, clavesExistentes, clavesVistasEnArchivo) {
        const base = {
            linea: filaCruda.linea,
            fecha: filaCruda.fecha,
            codigo: filaCruda.codigo,
            nombre: filaCruda.nombreCrudo,
            horaEntrada: filaCruda.horaEntrada,
            horaSalida: filaCruda.horaSalida,
            empleadoId: null,
        };
        if (!filaCruda.horaEntrada || !filaCruda.horaSalida) {
            return {
                ...base,
                estado: estado_fila_importacion_enum_1.EstadoFilaImportacion.ERROR,
                mensajes: ['Fila ignorada: hora de entrada o salida vacía.'],
            };
        }
        let estado = estado_fila_importacion_enum_1.EstadoFilaImportacion.OK;
        const mensajes = [];
        let empleadoId = null;
        let nombre = filaCruda.nombreCrudo;
        if (filaCruda.fecha === null) {
            estado = agravar(estado, estado_fila_importacion_enum_1.EstadoFilaImportacion.ERROR);
            mensajes.push('Fecha vacía o con formato no reconocido.');
        }
        if (filaCruda.codigo === null) {
            estado = agravar(estado, estado_fila_importacion_enum_1.EstadoFilaImportacion.ERROR);
            mensajes.push('Código de empleado vacío o inválido.');
        }
        else {
            const empleado = await this.empleadoRepository.buscarPorCodigo(filaCruda.codigo);
            if (!empleado) {
                estado = agravar(estado, estado_fila_importacion_enum_1.EstadoFilaImportacion.ERROR);
                mensajes.push(`No existe un empleado con código ${filaCruda.codigo}.`);
            }
            else if (!empleado.activo) {
                estado = agravar(estado, estado_fila_importacion_enum_1.EstadoFilaImportacion.ERROR);
                mensajes.push(`El empleado con código ${filaCruda.codigo} está inactivo.`);
            }
            else {
                empleadoId = empleado.id;
                nombre = empleado.nombre;
                if (filaCruda.fecha !== null) {
                    const salario = await this.salarioRepository.buscarVigenteEn(empleado.id, filaCruda.fecha);
                    if (!salario) {
                        estado = agravar(estado, estado_fila_importacion_enum_1.EstadoFilaImportacion.ERROR);
                        mensajes.push('El empleado no tiene salario vigente en esta fecha.');
                    }
                }
            }
        }
        if (filaCruda.fecha !== null) {
            if (filaCruda.fecha < periodo.fechaInicio ||
                filaCruda.fecha > periodo.fechaFin) {
                estado = agravar(estado, estado_fila_importacion_enum_1.EstadoFilaImportacion.ADVERTENCIA);
                mensajes.push('La fecha está fuera del rango del periodo.');
            }
        }
        const { entrada, salida } = (0, hora_util_1.entradaSalidaAjustadas)(filaCruda.horaEntrada, filaCruda.horaSalida);
        const cruzaMedianoche = salida !== entrada && filaCruda.horaSalida < filaCruda.horaEntrada;
        if (cruzaMedianoche) {
            const duracionHoras = (salida - entrada) / 60;
            if (duracionHoras > MAX_HORAS_TURNO_RAZONABLE) {
                estado = agravar(estado, estado_fila_importacion_enum_1.EstadoFilaImportacion.ADVERTENCIA);
                mensajes.push(`Cruce de medianoche inusual: turno de ${duracionHoras}h, verifique los datos.`);
            }
        }
        if (empleadoId !== null && filaCruda.fecha !== null) {
            const clave = `${empleadoId}|${aFechaISO(filaCruda.fecha)}`;
            if (clavesExistentes.has(clave)) {
                estado = agravar(estado, estado_fila_importacion_enum_1.EstadoFilaImportacion.ADVERTENCIA);
                mensajes.push('Ya existe un registro para este empleado en esta fecha.');
            }
            else if (clavesVistasEnArchivo.has(clave)) {
                estado = agravar(estado, estado_fila_importacion_enum_1.EstadoFilaImportacion.ADVERTENCIA);
                mensajes.push('Fila duplicada dentro del archivo para este empleado y fecha.');
            }
            else {
                clavesVistasEnArchivo.add(clave);
            }
        }
        return { ...base, nombre, empleadoId, estado, mensajes };
    }
}
exports.ValidarFilasImportacionService = ValidarFilasImportacionService;
//# sourceMappingURL=validar-filas-importacion.service.js.map