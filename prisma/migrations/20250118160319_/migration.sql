/*
  Warnings:

  - You are about to drop the column `discountbypercent` on the `FeeStudentClass` table. All the data in the column will be lost.
  - You are about to drop the column `feeName` on the `fees` table. All the data in the column will be lost.
  - You are about to drop the column `tuition` on the `fees` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `fees` table. All the data in the column will be lost.
  - Added the required column `examFund` to the `fees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `fees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tuitionFee` to the `fees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeeStudentClass" DROP COLUMN "discountbypercent",
ADD COLUMN     "discountByPercent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "fees" DROP COLUMN "feeName",
DROP COLUMN "tuition",
DROP COLUMN "type",
ADD COLUMN     "admissionFee" DOUBLE PRECISION NOT NULL DEFAULT 5000,
ADD COLUMN     "computerLabFund" DOUBLE PRECISION,
ADD COLUMN     "examFund" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "infoAndCallsFee" DOUBLE PRECISION NOT NULL DEFAULT 500,
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "studentIdCardFee" DOUBLE PRECISION NOT NULL DEFAULT 500,
ADD COLUMN     "tuitionFee" DOUBLE PRECISION NOT NULL;
