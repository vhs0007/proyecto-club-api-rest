-- Cambios de schema: price en MembershipType, sin price en Membership, facilities_membership por membershipTypeId
-- Ejecutar contra la base cuando corresponda.

-- AlterTable: add price to MembershipType (with default for existing rows)
ALTER TABLE "MembershipType" ADD COLUMN "price" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable: remove price from Membership
ALTER TABLE "Membership" DROP COLUMN "price";

-- facilities_membership: add new column as nullable, backfill from Membership.typeId, then set NOT NULL and drop old column
ALTER TABLE "facilities_membership" ADD COLUMN "membershipTypeId" INTEGER;

UPDATE "facilities_membership" fm
SET "membershipTypeId" = COALESCE(
  (SELECT m."typeId" FROM "Membership" m WHERE m.id = fm."membershipId"),
  (SELECT id FROM "MembershipType" LIMIT 1)
);

ALTER TABLE "facilities_membership" ALTER COLUMN "membershipTypeId" SET NOT NULL;

ALTER TABLE "facilities_membership" DROP COLUMN "membershipId";

-- AddForeignKey
ALTER TABLE "facilities_membership" ADD CONSTRAINT "facilities_membership_membershipTypeId_fkey" FOREIGN KEY ("membershipTypeId") REFERENCES "MembershipType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "facilities_membership" ADD CONSTRAINT "facilities_membership_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
