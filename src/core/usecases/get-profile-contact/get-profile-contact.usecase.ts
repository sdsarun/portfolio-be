import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileContactOutput } from "./get-profile-contact.output";

export type GetProfileContactUseCasePort = UseCase<void, GetProfileContactOutput>;

export class GetProfileContactUseCase implements GetProfileContactUseCasePort {
  constructor(private readonly deps: { uow: UnitOfWork }) {}

  async execute(): Promise<GetProfileContactOutput> {
    const contacts = await this.deps.uow.contact.findAll();
    return { contacts: contacts.map((item) => item.fields) };
  }
}
