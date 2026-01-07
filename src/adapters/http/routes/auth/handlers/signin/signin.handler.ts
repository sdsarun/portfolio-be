import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type SignInUseCasePort } from "../../../../../../core/usecases/signin/signin.usecase";
import { type SignInBodyDTO, signInBodyDTOSchema } from "./signin.dto";
import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type SignInOutput } from "../../../../../../core/usecases/signin/signin.output";

export type SignInHandlerPort = HttpHandler<{ body: SignInBodyDTO }, SignInOutput>;

export class SignInHandler implements SignInHandlerPort {
  constructor(private readonly deps: { signInUseCase: SignInUseCasePort }) {}

  async handle(
    ctx: HttpContext<{ body: SignInBodyDTO }, Record<string, any>>
  ): Promise<HttpResponse<SignInOutput>> {
    const parsed = await signInBodyDTOSchema.safeParseAsync(ctx.request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.deps.signInUseCase.execute(parsed.data);
    return {
      statusCode: 201,
      data: result
    };
  }
}
