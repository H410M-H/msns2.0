-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "isAssign" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "employeeName" SET DEFAULT 'none',
ALTER COLUMN "employeeName" SET DATA TYPE TEXT,
ALTER COLUMN "fatherName" SET DEFAULT 'none',
ALTER COLUMN "fatherName" SET DATA TYPE TEXT,
ALTER COLUMN "cnic" SET DEFAULT '0000-0000000-0',
ALTER COLUMN "cnic" SET DATA TYPE TEXT,
ALTER COLUMN "mobileNo" SET DEFAULT 'none',
ALTER COLUMN "mobileNo" SET DATA TYPE TEXT,
ALTER COLUMN "additionalContact" SET DEFAULT 'none',
ALTER COLUMN "additionalContact" SET DATA TYPE TEXT,
ALTER COLUMN "education" SET DEFAULT 'none',
ALTER COLUMN "education" SET DATA TYPE TEXT,
ALTER COLUMN "profilePic" SET DEFAULT '/user.jpg';
