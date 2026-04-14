/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[clubId,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clubId,document]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userTypeId` to the `activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsibleWorkerTypeId` to the `facilities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_userId_clubId_fkey";

-- DropForeignKey
ALTER TABLE "facilities" DROP CONSTRAINT "facilities_assistantWorker_clubId_fkey";

-- DropForeignKey
ALTER TABLE "facilities" DROP CONSTRAINT "facilities_responsibleWorker_clubId_fkey";

-- DropForeignKey
ALTER TABLE "membership" DROP CONSTRAINT "membership_userId_clubId_fkey";

-- DropForeignKey
ALTER TABLE "time_entries" DROP CONSTRAINT "time_entries_userDocument_fkey";

-- DropIndex
DROP INDEX "users_document_key";

-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "userTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "facilities" ADD COLUMN     "assistantWorkerTypeId" INTEGER,
ADD COLUMN     "responsibleWorkerTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id", "clubId", "typeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_clubId_email_key" ON "users"("clubId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_clubId_document_key" ON "users"("clubId", "document");

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_userId_clubId_typeId_fkey" FOREIGN KEY ("userId", "clubId", "typeId") REFERENCES "users"("id", "clubId", "typeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_responsibleWorker_clubId_responsibleWorkerTypeI_fkey" FOREIGN KEY ("responsibleWorker", "clubId", "responsibleWorkerTypeId") REFERENCES "users"("id", "clubId", "typeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_assistantWorker_clubId_assistantWorkerTypeId_fkey" FOREIGN KEY ("assistantWorker", "clubId", "assistantWorkerTypeId") REFERENCES "users"("id", "clubId", "typeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_userId_clubId_userTypeId_fkey" FOREIGN KEY ("userId", "clubId", "userTypeId") REFERENCES "users"("id", "clubId", "typeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_userDocument_clubId_fkey" FOREIGN KEY ("userDocument", "clubId") REFERENCES "users"("document", "clubId") ON DELETE RESTRICT ON UPDATE CASCADE;
