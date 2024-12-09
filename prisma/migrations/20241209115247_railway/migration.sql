-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'CLERK');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('Married', 'Unmarried', 'Widow', 'Divorced');

-- CreateEnum
CREATE TYPE "Designation" AS ENUM ('Principal', 'Admin', 'Head', 'Clerk', 'Teacher', 'Worker');

-- CreateEnum
CREATE TYPE "ClassCategory" AS ENUM ('Montessori', 'Primary', 'Middle', 'SSC_I', 'SSC_II');

-- CreateTable
CREATE TABLE "classes" (
    "classId" TEXT NOT NULL,
    "className" TEXT NOT NULL DEFAULT 'none',
    "section" TEXT NOT NULL DEFAULT 'ROSE',
    "category" "ClassCategory" NOT NULL DEFAULT 'Montessori',
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("classId")
);

-- CreateTable
CREATE TABLE "students" (
    "studentId" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "studentMobile" TEXT NOT NULL DEFAULT 'none',
    "fatherMobile" TEXT NOT NULL DEFAULT 'none',
    "admissionNumber" TEXT NOT NULL,
    "studentName" TEXT NOT NULL DEFAULT 'none',
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TEXT NOT NULL DEFAULT 'none',
    "fatherName" TEXT NOT NULL DEFAULT 'none',
    "studentCNIC" TEXT NOT NULL DEFAULT '0000-0000000-0',
    "fatherCNIC" TEXT NOT NULL DEFAULT '0000-0000000-0',
    "fatherProfession" TEXT NOT NULL DEFAULT 'none',
    "bloodGroup" TEXT DEFAULT 'none',
    "guardianName" TEXT DEFAULT 'none',
    "caste" TEXT NOT NULL DEFAULT 'none',
    "currentAddress" TEXT NOT NULL DEFAULT 'none',
    "permanentAddress" TEXT NOT NULL DEFAULT 'none',
    "medicalProblem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAssign" BOOLEAN NOT NULL DEFAULT false,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountbypercent" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "students_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "employees" (
    "employeeId" TEXT NOT NULL,
    "employeeName" VARCHAR(100) NOT NULL,
    "fatherName" VARCHAR(100) NOT NULL,
    "gender" "Gender" NOT NULL,
    "dob" TEXT NOT NULL DEFAULT 'none',
    "cnic" CHAR(15) NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "doj" TEXT NOT NULL DEFAULT 'none',
    "designation" "Designation" NOT NULL,
    "residentialAddress" TEXT NOT NULL,
    "mobileNo" VARCHAR(13) NOT NULL,
    "additionalContact" VARCHAR(13),
    "education" VARCHAR(100) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "SalaryAssignment" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "baseSalary" DOUBLE PRECISION NOT NULL,
    "increment" DOUBLE PRECISION NOT NULL,
    "totalSalary" DOUBLE PRECISION NOT NULL,
    "assignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "SalaryAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryIncrement" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "incrementAmount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryIncrement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "sessionId" TEXT NOT NULL,
    "sessionName" TEXT NOT NULL DEFAULT 'none',
    "sessionFrom" TEXT NOT NULL DEFAULT 'none',
    "sessionTo" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "fees" (
    "feeId" TEXT NOT NULL,
    "feeName" TEXT NOT NULL,
    "feeTuition" INTEGER NOT NULL,
    "feePaper" INTEGER NOT NULL,
    "feeSport" INTEGER NOT NULL,
    "feeIdcard" INTEGER NOT NULL,
    "feeComm" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fees_pkey" PRIMARY KEY ("feeId")
);

-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "StudentClass" (
    "scId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "StudentClass_pkey" PRIMARY KEY ("scId")
);

-- CreateIndex
CREATE INDEX "classes_className_idx" ON "classes"("className");

-- CreateIndex
CREATE UNIQUE INDEX "students_registrationNumber_key" ON "students"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "students_admissionNumber_key" ON "students"("admissionNumber");

-- CreateIndex
CREATE INDEX "employees_employeeName_idx" ON "employees"("employeeName");

-- CreateIndex
CREATE INDEX "employees_cnic_idx" ON "employees"("cnic");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "SalaryAssignment" ADD CONSTRAINT "SalaryAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryAssignment" ADD CONSTRAINT "SalaryAssignment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryIncrement" ADD CONSTRAINT "SalaryIncrement_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClass" ADD CONSTRAINT "StudentClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClass" ADD CONSTRAINT "StudentClass_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClass" ADD CONSTRAINT "StudentClass_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;
