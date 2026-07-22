"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalcularDesgloseService = void 0;
const salario_no_vigente_error_1 = require("../../domain/errors/salario-no-vigente.error");
const motor_calculo_1 = require("../../domain/services/motor-calculo");
const configuracion_calculo_mapper_1 = require("./configuracion-calculo.mapper");
function aFechaISO(fecha) {
    return fecha.toISOString().slice(0, 10);
}
class CalcularDesgloseService {
    salarioRepository;
    feriadoRepository;
    configuracionRepository;
    tipoHoraExtraRepository;
    constructor(salarioRepository, feriadoRepository, configuracionRepository, tipoHoraExtraRepository) {
        this.salarioRepository = salarioRepository;
        this.feriadoRepository = feriadoRepository;
        this.configuracionRepository = configuracionRepository;
        this.tipoHoraExtraRepository = tipoHoraExtraRepository;
    }
    async calcular(empleadoId, fecha, horaEntrada, horaSalida) {
        const [salario, feriado, configuracionCruda, tiposHoraExtra] = await Promise.all([
            this.salarioRepository.buscarVigenteEn(empleadoId, fecha),
            this.feriadoRepository.buscarPorFecha(fecha),
            this.configuracionRepository.obtenerTodos(),
            this.tipoHoraExtraRepository.listar(),
        ]);
        if (!salario) {
            throw new salario_no_vigente_error_1.SalarioNoVigenteError(empleadoId, aFechaISO(fecha));
        }
        const { divisorSalario, parametrosMotor } = (0, configuracion_calculo_mapper_1.parsearConfiguracionCalculo)(configuracionCruda);
        const salarioHoraUsado = salario.montoMensual
            .dividedBy(divisorSalario)
            .dividedBy(parametrosMotor.horasJornada);
        const motor = new motor_calculo_1.MotorCalculo(tiposHoraExtra);
        return motor.calcular({
            fecha,
            horaEntrada,
            horaSalida,
            esFeriado: feriado !== null,
            salarioHoraUsado,
        }, parametrosMotor);
    }
}
exports.CalcularDesgloseService = CalcularDesgloseService;
//# sourceMappingURL=calcular-desglose.service.js.map