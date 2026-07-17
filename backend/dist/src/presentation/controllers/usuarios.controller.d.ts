import { ActualizarUsuarioUseCase } from '../../application/use-cases/usuarios/actualizar-usuario.use-case';
import { CrearUsuarioUseCase } from '../../application/use-cases/usuarios/crear-usuario.use-case';
import { ListarUsuariosUseCase } from '../../application/use-cases/usuarios/listar-usuarios.use-case';
import { ActualizarUsuarioDto } from '../dtos/usuarios/actualizar-usuario.dto';
import { CrearUsuarioDto } from '../dtos/usuarios/crear-usuario.dto';
import { UsuarioRespuestaDto } from '../dtos/usuarios/usuario-respuesta.dto';
export declare class UsuariosController {
    private readonly listarUsuarios;
    private readonly crearUsuario;
    private readonly actualizarUsuario;
    constructor(listarUsuarios: ListarUsuariosUseCase, crearUsuario: CrearUsuarioUseCase, actualizarUsuario: ActualizarUsuarioUseCase);
    listar(): Promise<UsuarioRespuestaDto[]>;
    crear(dto: CrearUsuarioDto): Promise<UsuarioRespuestaDto>;
    actualizar(id: string, dto: ActualizarUsuarioDto): Promise<UsuarioRespuestaDto>;
}
