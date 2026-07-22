"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportePeriodoService = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const tipo_hora_extra_codigo_enum_1 = require("../../domain/enums/tipo-hora-extra-codigo.enum");
const configuracion_calculo_mapper_1 = require("./configuracion-calculo.mapper");
const CLAVE_POR_CODIGO = {
    [tipo_hora_extra_codigo_enum_1.TipoHoraExtraCodigo.HE_35]: 'he35',
    [tipo_hora_extra_codigo_enum_1.TipoHoraExtraCodigo.HE_100]: 'he100',
    [tipo_hora_extra_codigo_enum_1.TipoHoraExtraCodigo.NOCTURNA_15]: 'nocturna',
    [tipo_hora_extra_codigo_enum_1.TipoHoraExtraCodigo.FERIADO]: 'feriado',
};
function desgloseCero() {
    return {
        he35: new decimal_js_1.default(0),
        he100: new decimal_js_1.default(0),
        nocturna: new decimal_js_1.default(0),
        feriado: new decimal_js_1.default(0),
    };
}
class ReportePeriodoService {
    registroHorasRepository;
    empleadoRepository;
    salarioRepository;
    configuracionRepository;
    constructor(registroHorasRepository, empleadoRepository, salarioRepository, configuracionRepository) {
        this.registroHorasRepository = registroHorasRepository;
        this.empleadoRepository = empleadoRepository;
        this.salarioRepository = salarioRepository;
        this.configuracionRepository = configuracionRepository;
    }
    async generar(periodo) {
        const registros = await this.registroHorasRepository.listarPorPeriodo(periodo.id);
        const registrosPorEmpleado = new Map();
        for (const registroConCalculos of registros) {
            const empleadoId = registroConCalculos.registro.empleadoId;
            const lista = registrosPorEmpleado.get(empleadoId) ?? [];
            lista.push(registroConCalculos);
            registrosPorEmpleado.set(empleadoId, lista);
        }
        const parametrosSalario = await this.obtenerParametrosSalario();
        const filas = [];
        for (const [empleadoId, registrosEmpleado] of registrosPorEmpleado) {
            const empleado = await this.empleadoRepository.buscarPorId(empleadoId);
            if (!empleado) {
                continue;
            }
            filas.push(await this.agregarFilaEmpleado(empleado, registrosEmpleado, parametrosSalario));
        }
        filas.sort((a, b) => a.empleado.codigo - b.empleado.codigo);
        const granTotal = filas.reduce((acumulado, fila) => acumulado.plus(fila.total), new decimal_js_1.default(0));
        return { periodo, filas, granTotal };
    }
    async generarFilaEmpleado(periodo, empleado) {
        const registros = await this.registroHorasRepository.listarPorPeriodo(periodo.id, empleado.id);
        const parametrosSalario = await this.obtenerParametrosSalario();
        const fila = await this.agregarFilaEmpleado(empleado, registros, parametrosSalario);
        return { fila, registros };
    }
    async obtenerParametrosSalario() {
        const configuracion = await this.configuracionRepository.obtenerTodos();
        const { divisorSalario, parametrosMotor } = (0, configuracion_calculo_mapper_1.parsearConfiguracionCalculo)(configuracion);
        return { divisorSalario, horasJornada: parametrosMotor.horasJornada };
    }
    async agregarFilaEmpleado(empleado, registros, parametrosSalario) {
        const horas = desgloseCero();
        const montos = desgloseCero();
        let salarioHora = null;
        let ultimaFecha = null;
        for (const { registro, calculos } of registros) {
            if (!ultimaFecha || registro.fecha > ultimaFecha) {
                ultimaFecha = registro.fecha;
            }
            for (const calculo of calculos) {
                const clave = CLAVE_POR_CODIGO[calculo.tipoHoraCodigo];
                horas[clave] = horas[clave].plus(calculo.cantidadHoras);
                montos[clave] = montos[clave].plus(calculo.monto);
                salarioHora = calculo.salarioHoraUsado;
            }
        }
        if (salarioHora === null) {
            const salario = await this.salarioRepository.buscarVigenteEn(empleado.id, ultimaFecha ?? new Date());
            salarioHora = salario
                ? salario.montoMensual
                    .dividedBy(parametrosSalario.divisorSalario)
                    .dividedBy(parametrosSalario.horasJornada)
                : new decimal_js_1.default(0);
        }
        const total = montos.he35
            .plus(montos.he100)
            .plus(montos.nocturna)
            .plus(montos.feriado);
        return {
            empleado: {
                id: empleado.id,
                codigo: empleado.codigo,
                nombre: empleado.nombre,
            },
            salarioHora,
            horas,
            montos,
            total,
        };
    }
}
exports.ReportePeriodoService = ReportePeriodoService;
//# sourceMappingURL=reporte-periodo.service.js.map