/*
  Warnings:

  - A unique constraint covering the columns `[admissionNumber]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admissionNumber` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "admissionNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employees_admissionNumber_key" ON "employees"("admissionNumber");
