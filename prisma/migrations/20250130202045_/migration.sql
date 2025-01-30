/*
  Warnings:

  - The primary key for the `ClassSubject` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "ClassSubject_csId_key";

-- AlterTable
ALTER TABLE "ClassSubject" DROP CONSTRAINT "ClassSubject_pkey",
ADD CONSTRAINT "ClassSubject_pkey" PRIMARY KEY ("csId");
