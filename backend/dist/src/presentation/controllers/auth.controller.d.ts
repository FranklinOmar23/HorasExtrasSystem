import { AutenticarUsuarioUseCase } from '../../application/use-cases/auth/autenticar-usuario.use-case';
import { LoginRespuestaDto } from '../dtos/auth/login-respuesta.dto';
import { LoginDto } from '../dtos/auth/login.dto';
export declare class AuthController {
    private readonly autenticarUsuario;
    constructor(autenticarUsuario: AutenticarUsuarioUseCase);
    login(dto: LoginDto): Promise<LoginRespuestaDto>;
}
