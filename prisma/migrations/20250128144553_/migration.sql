/*
  Warnings:

  - Added the required column `employeeId` to the `StudentClass` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "employees_employeeName_idx";

-- DropIndex
DROP INDEX "employees_registrationNumber_idx";

-- AlterTable
ALTER TABLE "StudentClass" ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentClass" ADD CONSTRAINT "StudentClass_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
