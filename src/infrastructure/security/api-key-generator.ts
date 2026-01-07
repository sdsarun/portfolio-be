import { randomBytes } from "crypto";
import {
  type ApiKeyGenerator,
  type ApiKeyGeneratorOutput
} from "../../core/ports/api-key-generator.port";
import { type Hasher } from "../../core/ports/hasher.port";

export class DefaultApiKeyGenerator implements ApiKeyGenerator {
  private readonly defaultPrefix: string = "pk_live_";

  constructor(private readonly hasher: Hasher) {}

  async generate(): Promise<ApiKeyGeneratorOutput> {
    const plaintext = this.defaultPrefix + randomBytes(32).toString("hex");
    const hashed = await this.hasher.hash(plaintext);
    return { plaintext, hashed };
  }
}
