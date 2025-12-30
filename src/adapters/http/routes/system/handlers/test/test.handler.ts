import { ForDevelopmentOnlyUseCasePort } from "../../../../../../core/usecases/for-development-only/for-development-only.usecase";
import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";

export type TestHandlerPort = HttpHandler;

export class TestHandler implements HttpHandler {
  constructor(
    private readonly deps: {
      testUseCase: ForDevelopmentOnlyUseCasePort;
    }
  ) {}

  async handle(): Promise<HttpResponse> {
    await this.deps.testUseCase.execute({ payload: {} });
    return {
      success: true,
      data: {
        ts: Date.now()
      },
      statusCode: 200
    };
  }
}
