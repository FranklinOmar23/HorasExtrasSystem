"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarUsuariosUseCase = void 0;
class ListarUsuariosUseCase {
    usuarioRepository;
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    ejecutar() {
        return this.usuarioRepository.listar();
    }
}
exports.ListarUsuariosUseCase = ListarUsuariosUseCase;
//# sourceMappingURL=listar-usuarios.use-case.js.map