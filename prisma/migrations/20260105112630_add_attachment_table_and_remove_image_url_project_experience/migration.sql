/*
  Warnings:

  - You are about to drop the column `image_url` on the `project_experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project_experience" DROP COLUMN "image_url";

-- CreateTable
CREATE TABLE "attachments" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "size" INTEGER,
    "extension" TEXT,
    "sha" TEXT,
    "stored_path" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_experience_attachments" (
    "id" UUID NOT NULL,
    "project_experience_id" UUID NOT NULL,
    "attachment_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "project_experience_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_experience_attachments_project_experience_id_idx" ON "project_experience_attachments"("project_experience_id");

-- CreateIndex
CREATE INDEX "project_experience_attachments_attachment_id_idx" ON "project_experience_attachments"("attachment_id");

-- AddForeignKey
ALTER TABLE "project_experience_attachments" ADD CONSTRAINT "project_experience_attachments_project_experience_id_fkey" FOREIGN KEY ("project_experience_id") REFERENCES "project_experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_experience_attachments" ADD CONSTRAINT "project_experience_attachments_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
