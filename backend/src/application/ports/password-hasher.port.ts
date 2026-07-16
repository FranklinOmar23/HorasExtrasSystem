export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface PasswordHasher {
  comparar(plano: string, hash: string): Promise<boolean>;
  hashear(plano: string): Promise<string>;
}
