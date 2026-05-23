/*
  Warnings:

  - A unique constraint covering the columns `[facilityId,userId,clubId,userTypeId]` on the table `facility_workers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "facility_workers_facilityId_userId_clubId_userTypeId_key" ON "facility_workers"("facilityId", "userId", "clubId", "userTypeId");
