import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type UpsertProfileContactInput } from "./upsert-profile-contact.input";
import { type UpsertProfileContactOutput } from "./upsert-profile-contact.output";
import { type Contact } from "../../entities/contact/contact.entity";
import { ContactType } from "../../constants/contact-type.constant";

export type UpsertProfileContactUseCasePort = UseCase<
  UpsertProfileContactInput,
  UpsertProfileContactOutput
>;

export class UpsertProfileContactUseCase implements UpsertProfileContactUseCasePort {
  constructor(private readonly deps: { uow: UnitOfWork; authId: string }) {}

  async execute(input: UpsertProfileContactInput): Promise<UpsertProfileContactOutput> {
    return this.deps.uow.runInTransaction(async (uow) => {
      let profile = await uow.profile.findByAuthId(this.deps.authId);
      if (!profile) {
        profile = await uow.profile.create({ authId: this.deps.authId });
      }

      const profileId = profile.fields.id!;

      const existingForProfile = await uow.contact.findByProfileId(profileId);

      if (!input.contacts) {
        return { contacts: existingForProfile.map((item) => item.fields) };
      }

      const keptIds = new Set<string>();
      const saved: Contact[] = [];

      for (const [index, item] of input.contacts.entries()) {
        const current = item.id
          ? existingForProfile.find((existingItem) => existingItem.fields.id === item.id)
          : undefined;

        const type = item.type !== undefined ? item.type : (current?.fields.type ?? null);
        const value = item.value !== undefined ? item.value : (current?.fields.value ?? null);

        const record = await uow.contact.upsert({
          id: item.id,
          profileId,
          type,
          value: this.formatContactValue(type, value),
          label: item.label !== undefined ? item.label : (current?.fields.label ?? null),
          displayValue:
            item.displayValue !== undefined ? item.displayValue : (current?.fields.displayValue ?? null),
          displayOrder: item.displayOrder ?? current?.fields.displayOrder ?? index + 1
        });

        if (record.fields.id) {
          keptIds.add(record.fields.id);
        }

        saved.push(record);
      }

      const toDelete = existingForProfile
        .map((item) => item.fields.id)
        .filter((id): id is string => typeof id === "string" && !keptIds.has(id));

      await Promise.all(toDelete.map((id) => uow.contact.deleteById(id)));

      return { contacts: saved.map((item) => item.fields) };
    });
  }

  private formatContactValue(
    type: string | null | undefined,
    value: string | null | undefined
  ): string | null {
    if (!value) return value ?? null;
    if (type === ContactType.EMAIL && !value.startsWith("mailto:")) {
      return `mailto:${value}`;
    }
    return value;
  }
}
