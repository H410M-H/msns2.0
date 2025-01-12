/*
  Warnings:

  - You are about to drop the column `discount` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `discountbypercent` on the `students` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "students" DROP COLUMN "discount",
DROP COLUMN "discountbypercent";

-- CreateTable
CREATE TABLE "FeeStudentClass" (
    "sfcId" TEXT NOT NULL,
    "studentClassId" TEXT NOT NULL,
    "feeId" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountbypercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeStudentClass_pkey" PRIMARY KEY ("sfcId")
);

-- AddForeignKey
ALTER TABLE "FeeStudentClass" ADD CONSTRAINT "FeeStudentClass_studentClassId_fkey" FOREIGN KEY ("studentClassId") REFERENCES "StudentClass"("scId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeStudentClass" ADD CONSTRAINT "FeeStudentClass_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "fees"("feeId") ON DELETE RESTRICT ON UPDATE CASCADE;
