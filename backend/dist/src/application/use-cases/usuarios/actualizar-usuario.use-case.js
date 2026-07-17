"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarUsuarioUseCase = void 0;
const usuario_no_encontrado_error_1 = require("../../../domain/errors/usuario-no-encontrado.error");
class ActualizarUsuarioUseCase {
    usuarioRepository;
    passwordHasher;
    constructor(usuarioRepository, passwordHasher) {
        this.usuarioRepository = usuarioRepository;
        this.passwordHasher = passwordHasher;
    }
    async ejecutar(id, comando) {
        const usuario = await this.usuarioRepository.buscarPorId(id);
        if (!usuario) {
            throw new usuario_no_encontrado_error_1.UsuarioNoEncontradoError(id);
        }
        const passwordHash = comando.password
            ? await this.passwordHasher.hashear(comando.password)
            : undefined;
        return this.usuarioRepository.actualizar(id, {
            nombre: comando.nombre,
            rol: comando.rol,
            activo: comando.activo,
            passwordHash,
        });
    }
}
exports.ActualizarUsuarioUseCase = ActualizarUsuarioUseCase;
//# sourceMappingURL=actualizar-usuario.use-case.js.map