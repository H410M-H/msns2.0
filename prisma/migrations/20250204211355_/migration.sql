/*
  Warnings:

  - You are about to drop the column `employeeId` on the `StudentClass` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentClass" DROP CONSTRAINT "StudentClass_employeeId_fkey";

-- AlterTable
ALTER TABLE "StudentClass" DROP COLUMN "employeeId";
