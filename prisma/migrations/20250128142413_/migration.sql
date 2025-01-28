/*
  Warnings:

  - A unique constraint covering the columns `[registrationNumber]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registrationNumber` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "employees_cnic_idx";

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "registrationNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employees_registrationNumber_key" ON "employees"("registrationNumber");

-- CreateIndex
CREATE INDEX "employees_registrationNumber_idx" ON "employees"("registrationNumber");
