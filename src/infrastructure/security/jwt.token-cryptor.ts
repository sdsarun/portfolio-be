import {
  type SignOptions,
  type TokenPayload,
  type TokenCryptor
} from "../../core/ports/token-cryptor.port";
import * as jwt from "jsonwebtoken";
import { type SignOptions as JwtSignOptions } from "jsonwebtoken";
import { env } from "../env/env.config";

export type InitJwtTokenCryptorOptions = {
  secret: string;
};

export class JwtTokenCryptor implements TokenCryptor {
  private secret: string;
  private defaultExpiresIn: string = env.TOKEN_EXP;
  private defaultIssuer: string = env.SERVICE_NAME;

  constructor({ secret }: InitJwtTokenCryptorOptions) {
    this.secret = secret;
  }

  sign(payload: any, options?: SignOptions): Promise<string> {
    const jwtOptions: JwtSignOptions = {
      expiresIn: this.defaultExpiresIn as JwtSignOptions["expiresIn"],
      issuer: this.defaultIssuer,
      ...(options ?? {})
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secret, jwtOptions, (err, token) => {
        if (err || !token) {
          reject(err ?? new Error("Failed to sign token"));
          return;
        }

        resolve(token);
      });
    });
  }

  verify(token: string): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err || !decoded) {
          reject(err ?? new Error("Failed to verify token"));
          return;
        }

        resolve(decoded as TokenPayload);
      });
    });
  }
}
