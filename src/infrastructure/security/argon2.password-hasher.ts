import { type PasswordHasher } from "../../core/ports/password-hasher.port";
import * as argon2 from "argon2";

export type Argon2PasswordHasherOptions = {
  pepper: string;
};

export class Argon2PasswordHasher implements PasswordHasher {
  constructor(private readonly options: Argon2PasswordHasherOptions) {}

  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
      secret: Buffer.from(this.options.pepper)
    });
  }

  async verify(password: string, hashed: string): Promise<boolean> {
    return argon2.verify(hashed, password, { secret: Buffer.from(this.options.pepper) });
  }
}
