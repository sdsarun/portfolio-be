/*
  Warnings:

  - You are about to drop the column `auth_id` on the `api_keys` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_auth_id_fkey";

-- DropIndex
DROP INDEX "api_keys_auth_id_idx";

-- AlterTable
ALTER TABLE "api_keys" DROP COLUMN "auth_id";
