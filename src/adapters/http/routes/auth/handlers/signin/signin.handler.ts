import type { HttpContext, HttpHandler, HttpResponse } from "../../../../http-adapter.port";
import { SignInUseCase } from "../../../../../../core/usecases/signin/signin.usecase";
import { signInInputDTOSchema } from "./signin.dto";
import { ValidationError } from "../../../../../../core/errors/validation.error";

export class SignInHandler implements HttpHandler {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async handle({ request }: HttpContext): Promise<HttpResponse> {
    const parsed = await signInInputDTOSchema.safeParseAsync(request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.signInUseCase.execute(parsed.data);
    return {
      success: true,
      statusCode: 201,
      data: result
    };
  }
}
