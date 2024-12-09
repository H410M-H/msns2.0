/*
  Warnings:

  - You are about to drop the column `className` on the `classes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "classes_className_idx";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "className",
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'none';

-- CreateIndex
CREATE INDEX "classes_name_idx" ON "classes"("name");
