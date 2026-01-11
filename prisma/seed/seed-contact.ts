import { type PrismaClientOrTransaction } from "../../src/infrastructure/db/prisma/prisma-database-session";
import { ContactType } from "../../src/core/constants/contact-type.constant";
import { logger } from "../../src/infrastructure/logger/logger";

export async function seedContacts(db: PrismaClientOrTransaction, profileId: string) {
  const exists = await db.contact.findFirst({
    where: { profileId }
  });

  logger.info({ exists }, "contact exists");

  function capitalize(str?: string, locale: string = "en-US"): string {
    if (!str) return "";
    const [first, ...rest] = Array.from(str);
    return first.toLocaleUpperCase(locale) + rest.join("");
  }

  if (!exists) {
    await db.contact.createMany({
      data: [
        {
          profileId,
          displayOrder: 1,
          type: ContactType.EMAIL,
          label: capitalize(ContactType.EMAIL),
          value: "mailto:sdsarun@outlook.com",
          displayValue: "sdsarun@outlook.com"
        },
        {
          profileId,
          displayOrder: 2,
          type: ContactType.LINK,
          label: capitalize(ContactType.LINK),
          value: "https://www.linkedin.com/in/sdsarun/",
          displayValue: "linkedin.com/in/sdsarun"
        },
        {
          profileId,
          displayOrder: 3,
          type: ContactType.LINK,
          label: capitalize(ContactType.LINK),
          value: "https://github.com/sdsarun",
          displayValue: "github.com/sdsarun"
        }
      ]
    });
    logger.info("contact not exists, created.");
  } else {
    logger.info("contact exists, skip created.");
  }
}
