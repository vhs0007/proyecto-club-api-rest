/*
  Warnings:

  - The primary key for the `activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `facilities` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "facilities_membership" DROP CONSTRAINT "facilities_membership_facilityId_fkey";

-- AlterTable
ALTER TABLE "activity" DROP CONSTRAINT "activity_pkey",
ADD CONSTRAINT "activity_pkey" PRIMARY KEY ("id", "clubId");

-- AlterTable
ALTER TABLE "facilities" DROP CONSTRAINT "facilities_pkey",
ADD CONSTRAINT "facilities_pkey" PRIMARY KEY ("id", "clubId");

-- AddForeignKey
ALTER TABLE "facilities_membership" ADD CONSTRAINT "facilities_membership_facilityId_clubId_fkey" FOREIGN KEY ("facilityId", "clubId") REFERENCES "facilities"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_facilityId_clubId_fkey" FOREIGN KEY ("facilityId", "clubId") REFERENCES "facilities"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;
