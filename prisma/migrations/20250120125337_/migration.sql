/*
  Warnings:

  - You are about to drop the column `profilePicture` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "profilePicture",
ADD COLUMN     "profilePic" TEXT;
