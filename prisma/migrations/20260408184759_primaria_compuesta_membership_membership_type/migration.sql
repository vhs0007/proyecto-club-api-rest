/*
  Warnings:

  - The primary key for the `facilities_membership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `membership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `membership_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `clubId` to the `facilities_membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "facilities_membership" DROP CONSTRAINT "facilities_membership_membershipTypeId_fkey";

-- DropForeignKey
ALTER TABLE "membership" DROP CONSTRAINT "membership_typeId_fkey";

-- AlterTable
ALTER TABLE "facilities_membership" DROP CONSTRAINT "facilities_membership_pkey",
ADD COLUMN     "clubId" INTEGER NOT NULL,
ADD CONSTRAINT "facilities_membership_pkey" PRIMARY KEY ("id", "clubId");

-- AlterTable
ALTER TABLE "membership" DROP CONSTRAINT "membership_pkey",
ADD CONSTRAINT "membership_pkey" PRIMARY KEY ("id", "clubId");

-- AlterTable
ALTER TABLE "membership_type" DROP CONSTRAINT "membership_type_pkey",
ADD CONSTRAINT "membership_type_pkey" PRIMARY KEY ("id", "clubId");

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_typeId_clubId_fkey" FOREIGN KEY ("typeId", "clubId") REFERENCES "membership_type"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities_membership" ADD CONSTRAINT "facilities_membership_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities_membership" ADD CONSTRAINT "facilities_membership_membershipTypeId_clubId_fkey" FOREIGN KEY ("membershipTypeId", "clubId") REFERENCES "membership_type"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;
