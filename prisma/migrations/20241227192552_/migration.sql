/*
  Warnings:

  - You are about to drop the column `feeComm` on the `fees` table. All the data in the column will be lost.
  - You are about to drop the column `feeIdcard` on the `fees` table. All the data in the column will be lost.
  - You are about to drop the column `feePaper` on the `fees` table. All the data in the column will be lost.
  - You are about to drop the column `feeSport` on the `fees` table. All the data in the column will be lost.
  - You are about to drop the column `feeTuition` on the `fees` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FeeCategory" AS ENUM ('MonthlyFee', 'AnnualFee');

-- AlterTable
ALTER TABLE "fees" DROP COLUMN "feeComm",
DROP COLUMN "feeIdcard",
DROP COLUMN "feePaper",
DROP COLUMN "feeSport",
DROP COLUMN "feeTuition",
ADD COLUMN     "tuition" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "type" "FeeCategory" NOT NULL DEFAULT 'MonthlyFee';
