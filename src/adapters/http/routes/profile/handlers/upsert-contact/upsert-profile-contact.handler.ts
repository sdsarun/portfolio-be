import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type UpsertProfileContactUseCasePort } from "../../../../../../core/usecases/upsert-profile-contact/upsert-profile-contact.usecase";
import {
  UpsertProfileContactDTO,
  upsertProfileContactInputDTOSchema
} from "./upsert-profile-contact.dto";

export type UpsertProfileContactHandlerPort = HttpHandler<{ body: UpsertProfileContactDTO }>;

export class UpsertProfileContactHandler implements UpsertProfileContactHandlerPort {
  constructor(private readonly deps: { upsertProfileContactUseCase: UpsertProfileContactUseCasePort }) {}

  async handle({ request }: HttpContext<{ body: UpsertProfileContactDTO }>): Promise<HttpResponse> {
    const parsed = await upsertProfileContactInputDTOSchema.safeParseAsync(request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.deps.upsertProfileContactUseCase.execute(parsed.data);

    return {
      statusCode: 200,
      data: result
    };
  }
}
