"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearUsuarioUseCase = void 0;
const usuario_email_duplicado_error_1 = require("../../../domain/errors/usuario-email-duplicado.error");
class CrearUsuarioUseCase {
    usuarioRepository;
    passwordHasher;
    constructor(usuarioRepository, passwordHasher) {
        this.usuarioRepository = usuarioRepository;
        this.passwordHasher = passwordHasher;
    }
    async ejecutar(comando) {
        const existente = await this.usuarioRepository.buscarPorEmail(comando.email);
        if (existente) {
            throw new usuario_email_duplicado_error_1.UsuarioEmailDuplicadoError(comando.email);
        }
        const passwordHash = await this.passwordHasher.hashear(comando.password);
        return this.usuarioRepository.crear({
            nombre: comando.nombre,
            email: comando.email,
            passwordHash,
            rol: comando.rol,
        });
    }
}
exports.CrearUsuarioUseCase = CrearUsuarioUseCase;
//# sourceMappingURL=crear-usuario.use-case.js.map