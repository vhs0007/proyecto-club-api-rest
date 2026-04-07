-- CreateTable
CREATE TABLE "numerator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "numerator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "numerator" ADD CONSTRAINT "numerator_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
