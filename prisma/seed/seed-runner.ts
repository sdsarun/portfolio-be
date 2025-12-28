import { seedAuth } from "./seed-auth";
import { seedCertification } from "./seed-certification";
import { seedContacts } from "./seed-contact";
import { seedProfile } from "./seed-profile";
import { seedEducation } from "./seed-education";
import { seedProjectExperience } from "./seed-project-experience";
import { seedSkills } from "./seed-skill";
import { seedWorkExperience } from "./seed-work-experience";
import { DatabaseManager } from "../../src/infrastructure/db/database-manager";

const db = DatabaseManager.get("prisma");

async function main() {
  await db.connect();

  await db.transaction(async (transaction) => {
    await seedAuth(transaction);
    const profile = await seedProfile(transaction);

    await seedContacts(transaction, profile.id);
    await seedSkills(transaction, profile.id);
    await seedEducation(transaction, profile.id);
    await seedCertification(transaction, profile.id);
    await seedProjectExperience(transaction, profile.id);
    await seedWorkExperience(transaction, profile.id);
  });
}

main()
  .then(async () => {
    await db.disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.disconnect();
    process.exit(1);
  });
