-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "cv" TEXT,
ADD COLUMN     "profilePicture" TEXT;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "profilePic" TEXT NOT NULL DEFAULT 'none';
