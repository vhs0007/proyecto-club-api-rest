-- DropForeignKey
ALTER TABLE "expirations" DROP CONSTRAINT "expirations_memberId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_membershipId_fkey";

-- DropIndex
DROP INDEX "Membership_typeId_key";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "price",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MembershipType" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "expirations" DROP COLUMN "memberId";

-- AlterTable
ALTER TABLE "facilities_membership" DROP COLUMN "membershipId",
ADD COLUMN     "membershipTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "membershipId";

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities_membership" ADD CONSTRAINT "facilities_membership_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities_membership" ADD CONSTRAINT "facilities_membership_membershipTypeId_fkey" FOREIGN KEY ("membershipTypeId") REFERENCES "MembershipType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
