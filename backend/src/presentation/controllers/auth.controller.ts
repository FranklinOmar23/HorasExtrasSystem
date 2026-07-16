import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutenticarUsuarioUseCase } from '../../application/use-cases/auth/autenticar-usuario.use-case';
import { LoginRespuestaDto } from '../dtos/auth/login-respuesta.dto';
import { LoginDto } from '../dtos/auth/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AutenticarUsuarioUseCase)
    private readonly autenticarUsuario: AutenticarUsuarioUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica un usuario y devuelve un JWT' })
  @ApiResponse({ status: 200, type: LoginRespuestaDto })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() dto: LoginDto): Promise<LoginRespuestaDto> {
    return this.autenticarUsuario.ejecutar(dto);
  }
}
