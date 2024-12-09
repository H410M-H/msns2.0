/*
  Warnings:

  - You are about to drop the column `name` on the `classes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "classes_name_idx";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "name",
ADD COLUMN     "grade" TEXT NOT NULL DEFAULT 'none';

-- CreateIndex
CREATE INDEX "classes_grade_idx" ON "classes"("grade");
