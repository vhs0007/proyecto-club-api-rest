/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "facilities" DROP CONSTRAINT "facilities_assistantWorker_fkey";

-- DropForeignKey
ALTER TABLE "facilities" DROP CONSTRAINT "facilities_responsibleWorker_fkey";

-- DropForeignKey
ALTER TABLE "membership" DROP CONSTRAINT "membership_userId_fkey";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id", "clubId");

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_userId_clubId_fkey" FOREIGN KEY ("userId", "clubId") REFERENCES "users"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_responsibleWorker_clubId_fkey" FOREIGN KEY ("responsibleWorker", "clubId") REFERENCES "users"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_assistantWorker_clubId_fkey" FOREIGN KEY ("assistantWorker", "clubId") REFERENCES "users"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_userId_clubId_fkey" FOREIGN KEY ("userId", "clubId") REFERENCES "users"("id", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;
