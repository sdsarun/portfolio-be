/*
  Warnings:

  - A unique constraint covering the columns `[auth_id]` on the table `profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "certifications" ADD COLUMN     "profile_id" UUID;

-- AlterTable
ALTER TABLE "contact" ADD COLUMN     "profile_id" UUID;

-- AlterTable
ALTER TABLE "education" ADD COLUMN     "profile_id" UUID;

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "auth_id" UUID;

-- AlterTable
ALTER TABLE "project_experience" ADD COLUMN     "profile_id" UUID;

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "profile_id" UUID;

-- AlterTable
ALTER TABLE "work_experience" ADD COLUMN     "profile_id" UUID;

-- CreateIndex
CREATE INDEX "certifications_profile_id_idx" ON "certifications"("profile_id");

-- CreateIndex
CREATE INDEX "contact_profile_id_idx" ON "contact"("profile_id");

-- CreateIndex
CREATE INDEX "education_profile_id_idx" ON "education"("profile_id");

-- CreateIndex
CREATE INDEX "profile_auth_id_idx" ON "profile"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_auth_id_key" ON "profile"("auth_id");

-- CreateIndex
CREATE INDEX "project_experience_profile_id_idx" ON "project_experience"("profile_id");

-- CreateIndex
CREATE INDEX "skills_profile_id_idx" ON "skills"("profile_id");

-- CreateIndex
CREATE INDEX "work_experience_profile_id_idx" ON "work_experience"("profile_id");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "auth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_experience" ADD CONSTRAINT "project_experience_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
