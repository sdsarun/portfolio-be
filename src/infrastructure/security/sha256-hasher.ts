import { createHash } from "crypto";
import { type Hasher } from "../../core/ports/hasher.port";

export class Sha256Hasher implements Hasher {
  async hash(value: string): Promise<string> {
    return createHash("sha256").update(value).digest("hex");
  }
}
