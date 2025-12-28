import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type UpsertProfileInfoInput } from "./upsert-profile-info.input";
import { type UpsertProfileInfoOutput } from "./upsert-profile-info.output";

export type UpsertProfileInfoUseCasePort = UseCase<
  UpsertProfileInfoInput,
  UpsertProfileInfoOutput
>;

export class UpsertProfileInfoUseCase implements UpsertProfileInfoUseCasePort {
  constructor(private readonly deps: { uow: UnitOfWork; authId: string }) {}

  async execute(input: UpsertProfileInfoInput): Promise<UpsertProfileInfoOutput> {
    const existing = await this.deps.uow.profile.findByAuthId(this.deps.authId);

    if (!existing) {
      const profile = await this.deps.uow.profile.create({
        authId: this.deps.authId,
        ...(input.displayName !== undefined ? { displayName: input.displayName } : {}),
        ...(input.roleName !== undefined ? { roleName: input.roleName } : {}),
        ...(input.bioTitle !== undefined ? { bioTitle: input.bioTitle } : {}),
        ...(input.bioDescription !== undefined ? { bioDescription: input.bioDescription } : {}),
        ...(input.siteUrl !== undefined ? { siteUrl: input.siteUrl } : {})
      });
      return { profile: profile.fields };
    }

    const updatePayload: Record<string, string | null> = {};
    if (input.displayName !== undefined) updatePayload.displayName = input.displayName;
    if (input.roleName !== undefined) updatePayload.roleName = input.roleName;
    if (input.bioTitle !== undefined) updatePayload.bioTitle = input.bioTitle;
    if (input.bioDescription !== undefined) updatePayload.bioDescription = input.bioDescription;
    if (input.siteUrl !== undefined) updatePayload.siteUrl = input.siteUrl;

    const profile =
      Object.keys(updatePayload).length === 0
        ? existing
        : await this.deps.uow.profile.updateById(existing.fields.id!, updatePayload);

    return { profile: profile.fields };
  }
}
