/*
  Warnings:

  - You are about to drop the column `extension` on the `attachments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "extension",
ADD COLUMN     "mime" TEXT,
ADD COLUMN     "storage_provider" TEXT,
ADD COLUMN     "storage_type" TEXT;
