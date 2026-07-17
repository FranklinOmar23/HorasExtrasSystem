import { PasswordHasher } from '../../application/ports/password-hasher.port';
export declare class BcryptPasswordHasher implements PasswordHasher {
    comparar(plano: string, hash: string): Promise<boolean>;
    hashear(plano: string): Promise<string>;
}
