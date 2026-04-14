/*
  Warnings:

  - You are about to drop the column `typeId` on the `membership` table. All the data in the column will be lost.
  - Added the required column `membershipTypeId` to the `membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userTypeId` to the `membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "membership" DROP CONSTRAINT "membership_typeId_clubId_fkey";

-- DropForeignKey
ALTER TABLE "membership" DROP CONSTRAINT "membership_userId_clubId_typeId_fkey";

-- AlterTable
ALTER TABLE "membership" DROP COLUMN "typeId",
ADD COLUMN     "membershipTypeId" INTEGER NOT NULL,
ADD COLUMN     "userTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_membershipTypeId_clubId_fkey" FOREIGN KEY ("membershipTypeId", "clubId") REFERENCES "membership_type"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_userId_clubId_userTypeId_fkey" FOREIGN KEY ("userId", "clubId", "userTypeId") REFERENCES "users"("id", "clubId", "typeId") ON DELETE RESTRICT ON UPDATE CASCADE;
