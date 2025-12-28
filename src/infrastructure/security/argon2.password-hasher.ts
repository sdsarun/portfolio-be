import { type PasswordHasher } from "../../core/ports/password-hasher.port";
import * as argon2 from "argon2";
import { env } from "../env/env.config";

export class Argon2PasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
      secret: Buffer.from(env.PASSWORD_PEPPER)
    });
  }

  async verify(password: string, hashed: string): Promise<boolean> {
    return argon2.verify(hashed, password, { secret: Buffer.from(env.PASSWORD_PEPPER) });
  }
}
