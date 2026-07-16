import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../../application/ports/password-hasher.port';

const RONDAS_SALT = 10;

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  comparar(plano: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plano, hash);
  }

  hashear(plano: string): Promise<string> {
    return bcrypt.hash(plano, RONDAS_SALT);
  }
}
