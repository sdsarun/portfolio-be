import { type SignOptions as JwtSignOptions } from "jsonwebtoken";

export type SignOptions = Pick<JwtSignOptions, "expiresIn" | "audience" | "issuer">;

export type TokenPayload = {
  [key: string]: any;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
};

export interface TokenCryptor {
  sign(payload: any, options?: SignOptions): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
