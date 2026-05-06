/*
  Warnings:

  - You are about to drop the column `assistantWorker` on the `facilities` table. All the data in the column will be lost.
  - You are about to drop the column `assistantWorkerTypeId` on the `facilities` table. All the data in the column will be lost.
  - You are about to drop the column `responsibleWorker` on the `facilities` table. All the data in the column will be lost.
  - You are about to drop the column `responsibleWorkerTypeId` on the `facilities` table. All the data in the column will be lost.
  - Added the required column `ResponsibleWorkerTypeId` to the `facilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ResponsibleWorkerUserId` to the `facilities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "facilities" DROP CONSTRAINT "facilities_assistantWorker_clubId_assistantWorkerTypeId_fkey";

-- DropForeignKey
ALTER TABLE "facilities" DROP CONSTRAINT "facilities_responsibleWorker_clubId_responsibleWorkerTypeI_fkey";

-- AlterTable
ALTER TABLE "facilities" DROP COLUMN "assistantWorker",
DROP COLUMN "assistantWorkerTypeId",
DROP COLUMN "responsibleWorker",
DROP COLUMN "responsibleWorkerTypeId",
ADD COLUMN     "ResponsibleWorkerTypeId" INTEGER NOT NULL,
ADD COLUMN     "ResponsibleWorkerUserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "scheduledActivityId" INTEGER;

-- CreateTable
CREATE TABLE "facility_workers" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userTypeId" INTEGER NOT NULL,

    CONSTRAINT "facility_workers_pkey" PRIMARY KEY ("id","facilityId","userId","clubId","userTypeId")
);

-- CreateTable
CREATE TABLE "scheduled_activities" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userTypeId" INTEGER NOT NULL,

    CONSTRAINT "scheduled_activities_pkey" PRIMARY KEY ("id","clubId")
);

-- CreateTable
CREATE TABLE "scheduled_activities_members" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "scheduledActivityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userTypeId" INTEGER NOT NULL,

    CONSTRAINT "scheduled_activities_members_pkey" PRIMARY KEY ("id","clubId","scheduledActivityId","userId","userTypeId")
);

-- CreateTable
CREATE TABLE "scheduled_activities_assistant_workers" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "scheduledActivityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userTypeId" INTEGER NOT NULL,

    CONSTRAINT "scheduled_activities_assistant_workers_pkey" PRIMARY KEY ("id","clubId","scheduledActivityId","userId","userTypeId")
);

-- CreateTable
CREATE TABLE "scheduled_activities_membership_types" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "membershipTypeId" INTEGER NOT NULL,
    "scheduledActivityId" INTEGER NOT NULL,

    CONSTRAINT "scheduled_activities_membership_types_pkey" PRIMARY KEY ("id","clubId","membershipTypeId","scheduledActivityId")
);

-- CreateTable
CREATE TABLE "working_days" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "dayOfWeek" TEXT NOT NULL,

    CONSTRAINT "working_days_pkey" PRIMARY KEY ("id","clubId")
);

-- CreateTable
CREATE TABLE "datetime_scheduled_activities" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "scheduledActivityId" INTEGER NOT NULL,
    "hourStart" TEXT NOT NULL,
    "hourEnd" TEXT NOT NULL,
    "workingDayId" INTEGER NOT NULL,

    CONSTRAINT "datetime_scheduled_activities_pkey" PRIMARY KEY ("id","clubId","scheduledActivityId","hourStart","hourEnd")
);

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_ResponsibleWorkerUserId_clubId_ResponsibleWorke_fkey" FOREIGN KEY ("ResponsibleWorkerUserId", "clubId", "ResponsibleWorkerTypeId") REFERENCES "users"("id", "clubId", "typeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_workers" ADD CONSTRAINT "facility_workers_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_workers" ADD CONSTRAINT "facility_workers_facilityId_clubId_fkey" FOREIGN KEY ("facilityId", "clubId") REFERENCES "facilities"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_workers" ADD CONSTRAINT "facility_workers_userId_clubId_userTypeId_fkey" FOREIGN KEY ("userId", "clubId", "userTypeId") REFERENCES "users"("id", "clubId", "typeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities" ADD CONSTRAINT "scheduled_activities_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities" ADD CONSTRAINT "scheduled_activities_facilityId_clubId_fkey" FOREIGN KEY ("facilityId", "clubId") REFERENCES "facilities"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities_members" ADD CONSTRAINT "scheduled_activities_members_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities_members" ADD CONSTRAINT "scheduled_activities_members_scheduledActivityId_clubId_fkey" FOREIGN KEY ("scheduledActivityId", "clubId") REFERENCES "scheduled_activities"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities_members" ADD CONSTRAINT "scheduled_activities_members_userId_clubId_userTypeId_fkey" FOREIGN KEY ("userId", "clubId", "userTypeId") REFERENCES "users"("id", "clubId", "typeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities_assistant_workers" ADD CONSTRAINT "scheduled_activities_assistant_workers_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities_assistant_workers" ADD CONSTRAINT "scheduled_activities_assistant_workers_scheduledActivityId_fkey" FOREIGN KEY ("scheduledActivityId", "clubId") REFERENCES "scheduled_activities"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities_assistant_workers" ADD CONSTRAINT "scheduled_activities_assistant_workers_userId_clubId_userT_fkey" FOREIGN KEY ("userId", "clubId", "userTypeId") REFERENCES "users"("id", "clubId", "typeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities_membership_types" ADD CONSTRAINT "scheduled_activities_membership_types_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities_membership_types" ADD CONSTRAINT "scheduled_activities_membership_types_membershipTypeId_clu_fkey" FOREIGN KEY ("membershipTypeId", "clubId") REFERENCES "membership_type"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities_membership_types" ADD CONSTRAINT "scheduled_activities_membership_types_scheduledActivityId__fkey" FOREIGN KEY ("scheduledActivityId", "clubId") REFERENCES "scheduled_activities"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_days" ADD CONSTRAINT "working_days_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datetime_scheduled_activities" ADD CONSTRAINT "datetime_scheduled_activities_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datetime_scheduled_activities" ADD CONSTRAINT "datetime_scheduled_activities_scheduledActivityId_clubId_fkey" FOREIGN KEY ("scheduledActivityId", "clubId") REFERENCES "scheduled_activities"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datetime_scheduled_activities" ADD CONSTRAINT "datetime_scheduled_activities_workingDayId_clubId_fkey" FOREIGN KEY ("workingDayId", "clubId") REFERENCES "working_days"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;
