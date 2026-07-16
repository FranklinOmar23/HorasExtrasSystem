"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutenticarUsuarioUseCase = void 0;
const credenciales_invalidas_error_1 = require("../../../domain/errors/credenciales-invalidas.error");
class AutenticarUsuarioUseCase {
    usuarioRepository;
    passwordHasher;
    tokenService;
    constructor(usuarioRepository, passwordHasher, tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
    }
    async ejecutar(comando) {
        const usuario = await this.usuarioRepository.buscarPorEmail(comando.email);
        if (!usuario || !usuario.activo) {
            throw new credenciales_invalidas_error_1.CredencialesInvalidasError();
        }
        const passwordValido = await this.passwordHasher.comparar(comando.password, usuario.passwordHash);
        if (!passwordValido) {
            throw new credenciales_invalidas_error_1.CredencialesInvalidasError();
        }
        return {
            accessToken: this.tokenService.generar(usuario),
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
        };
    }
}
exports.AutenticarUsuarioUseCase = AutenticarUsuarioUseCase;
//# sourceMappingURL=autenticar-usuario.use-case.js.map