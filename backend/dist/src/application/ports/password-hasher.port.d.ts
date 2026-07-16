export declare const PASSWORD_HASHER: unique symbol;
export interface PasswordHasher {
    comparar(plano: string, hash: string): Promise<boolean>;
    hashear(plano: string): Promise<string>;
}
