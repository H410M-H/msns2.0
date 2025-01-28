/*
  Warnings:

  - You are about to drop the `StudentClass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FeeStudentClass" DROP CONSTRAINT "FeeStudentClass_studentClassId_fkey";

-- DropForeignKey
ALTER TABLE "StudentClass" DROP CONSTRAINT "StudentClass_classId_fkey";

-- DropForeignKey
ALTER TABLE "StudentClass" DROP CONSTRAINT "StudentClass_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "StudentClass" DROP CONSTRAINT "StudentClass_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "StudentClass" DROP CONSTRAINT "StudentClass_studentId_fkey";

-- DropTable
DROP TABLE "StudentClass";

-- CreateTable
CREATE TABLE "ClassMembers" (
    "scId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "ClassMembers_pkey" PRIMARY KEY ("scId")
);

-- AddForeignKey
ALTER TABLE "ClassMembers" ADD CONSTRAINT "ClassMembers_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMembers" ADD CONSTRAINT "ClassMembers_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMembers" ADD CONSTRAINT "ClassMembers_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMembers" ADD CONSTRAINT "ClassMembers_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeStudentClass" ADD CONSTRAINT "FeeStudentClass_studentClassId_fkey" FOREIGN KEY ("studentClassId") REFERENCES "ClassMembers"("scId") ON DELETE RESTRICT ON UPDATE CASCADE;
