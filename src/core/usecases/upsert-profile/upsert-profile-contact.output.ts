import { type ContactAttributes } from "../../entities/contact/contact.entity";

export type UpsertProfileContactOutput = {
  contacts: ContactAttributes[];
};
