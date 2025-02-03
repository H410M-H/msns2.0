import { TRPCError } from "@trpc/server"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { z } from "zod"
import { generatePdf } from "~/lib/utils/pdf-reports"

const studentSchema = z.object({
  studentMobile: z.string(),
  fatherMobile: z.string(),
  studentName: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'CUSTOM']),
  dateOfBirth: z.string(),
  fatherName: z.string(),
  studentCNIC: z.string(),
  fatherCNIC: z.string(),
  fatherProfession: z.string(),
  bloodGroup: z.string().optional(),
  guardianName: z.string().optional(),
  caste: z.string(),
  currentAddress: z.string(),
  permanentAddress: z.string(),
  medicalProblem: z.string().optional(),
  profilePic: z.string().optional(),
})

export const StudentRouter = createTRPCRouter({
  getStudents: publicProcedure.query(async ({ ctx }) => {
    try {
      const students = await ctx.db.students.findMany()
      return students
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "Something went wrong.",
      })
    }
  }),

  getUnAllocateStudents: publicProcedure.query(async ({ ctx }) => {
    try {
      const students = await ctx.db.students.findMany({
        where: {
          isAssign: false
        }
      })
      return students
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "Something went wrong.",
      })
    }
  }),

  createStudent: publicProcedure
    .input(studentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Generate registration number
        const currentYear = new Date().getFullYear().toString().slice(-2)
        const latestStudent = await ctx.db.students.findFirst({
          where: {
            registrationNumber: {
              startsWith: `MSNS${currentYear}`,
            },
          },
          orderBy: {
            registrationNumber: 'desc',
          },
        })
        let newRegNumber
        if (latestStudent) {
          const latestNumber = parseInt(latestStudent.registrationNumber.slice(-4))
          newRegNumber = `MSNS${currentYear}${(latestNumber + 1).toString().padStart(4, '0')}`
        } else {
          newRegNumber = `MSNS${currentYear}0001`
        }

        // Generate admission number
        const latestAdmission = await ctx.db.students.findFirst({
          where: {
            admissionNumber: {
            },
          },
          orderBy: {
            admissionNumber: 'desc',
          },
        })
        let newAdmissionNumber
        if (latestAdmission) {
          const latestNumber = parseInt(latestAdmission.admissionNumber.slice(-3))
          newAdmissionNumber = `S${currentYear}${(latestNumber + 1).toString().padStart(3, '0')}`
        } else {
          newAdmissionNumber = `S${currentYear}001`
        }

        const newStudent = await ctx.db.students.create({
          data: {
            ...input,
            registrationNumber: newRegNumber,
            admissionNumber: newAdmissionNumber,
            dateOfBirth: new Date(input.dateOfBirth).toLocaleDateString(),
          }
        })
        return newStudent
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong'
        })
      }
    }),

  deleteStudentsByIds: publicProcedure
    .input(z.object({
      studentIds: z.string().array(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.students.deleteMany({
          where: {
            studentId: {
              in: input.studentIds,
            },
          },
        })
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Something went wrong."
        })
      }
    }),

  getStudentsByClassId: publicProcedure
    .input(z.object({
      classId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.students.findMany({
          where: {
            StudentClass: {
              some: {
                classId: input.classId
              }
            },
          },
        })
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Something went wrong."
        })
      }
    }),

generateStudentReport: publicProcedure.query(async ({ ctx }) => {
  try {
    const students = await ctx.db.students.findMany({
      select: {
        studentId: true,
        studentName: true,
        registrationNumber: true,
        admissionNumber: true,
        dateOfBirth: true,
        gender: true,
        fatherName: true,
        studentCNIC: true,
        fatherCNIC: true,
      }
    });

    if (!students.length) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No student records found.',
      });
    }

    // Define headers and map data accordingly
    const headers = [
      'studentId', 'studentName', 'registrationNumber', 'admissionNumber', 'Date of Birth', 
      'Gender', 'Father Name', 'Student CNIC', 'Father CNIC'
    ];
    const studentData = students.map(s => ({
      studentId: s.studentId,
      studentName: s.studentName,
      registrationNumber: s.registrationNumber,
      admissionNumber: s.admissionNumber,
      'Date of Birth': s.dateOfBirth,
      Gender: s.gender,
      'Father Name': s.fatherName,
      'Student CNIC': s.studentCNIC,
      'Father CNIC': s.fatherCNIC
    }));

    const pdfBuffer = await generatePdf(studentData, headers, 'Student Directory Report');

    return {
      pdf: Buffer.from(pdfBuffer).toString('base64'),
      message: 'PDF report generated successfully'
    };
  } catch (error) {
    console.error('Error generating student report:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to generate student report'
    });
  }
}),

});