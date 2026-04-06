/*
  Warnings:

  - You are about to drop the column `clubId` on the `user_type` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_type" DROP CONSTRAINT "user_type_clubId_fkey";

-- AlterTable
ALTER TABLE "user_type" DROP COLUMN "clubId";
