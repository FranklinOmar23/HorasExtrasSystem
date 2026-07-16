"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const rol_usuario_enum_1 = require("../enums/rol-usuario.enum");
class Usuario {
    id;
    nombre;
    email;
    passwordHash;
    rol;
    activo;
    constructor(id, nombre, email, passwordHash, rol, activo) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.passwordHash = passwordHash;
        this.rol = rol;
        this.activo = activo;
    }
    esAdmin() {
        return this.rol === rol_usuario_enum_1.RolUsuario.ADMIN;
    }
}
exports.Usuario = Usuario;
//# sourceMappingURL=usuario.entity.js.map