import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileContactOutput } from "./get-profile-contact.output";

export type GetProfileContactUseCasePort = UseCase<void, GetProfileContactOutput>;

export class GetProfileContactUseCase implements GetProfileContactUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      authId: string;
    }
  ) {}

  async execute(): Promise<GetProfileContactOutput> {
    const profile = await this.deps.uow.profile.findByAuthId(this.deps.authId);
    if (!profile?.fields.id) {
      return { contacts: [] };
    }

    const contacts = await this.deps.uow.contact.findByProfileId(profile.fields.id);
    return { contacts: contacts.map((item) => item.fields) };
  }
}
