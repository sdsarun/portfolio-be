/*
  Warnings:

  - You are about to drop the column `project_experience_id` on the `project_experience_attachments` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `project_experience_attachments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_experience_attachments" DROP CONSTRAINT "project_experience_attachments_project_experience_id_fkey";

-- DropIndex
DROP INDEX "project_experience_attachments_project_experience_id_idx";

-- AlterTable
ALTER TABLE "project_experience_attachments" DROP COLUMN "project_experience_id",
ADD COLUMN     "project_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "project_experience_attachments_project_id_idx" ON "project_experience_attachments"("project_id");

-- AddForeignKey
ALTER TABLE "project_experience_attachments" ADD CONSTRAINT "project_experience_attachments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project_experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
