import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const feeRouter = createTRPCRouter({
  getAllFees: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.fees.findMany();
    } catch (error) {
      console.error("Error in getAllFees:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve fees." });
    }
  }),

  createFee: publicProcedure
    .input(
      z.object({
        feeName: z.string().min(1, "Fee name is required"),
        tuition: z.number().min(0, "Tuition must be a positive number"),
        type: z.enum(["MonthlyFee", "AnnualFee"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.fees.create({
          data: input,
        });
      } catch (error) {
        console.error("Error in createFee:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create fee." });
      }
    }),

  updateFee: publicProcedure
    .input(
      z.object({
        feeId: z.string().min(1, "Fee ID is required"),
        feeName: z.string().min(1, "Fee name is required").optional(),
        tuition: z.number().min(0, "Tuition must be a positive number").optional(),
        type: z.enum(["MonthlyFee", "AnnualFee"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { feeId, ...updateData } = input;
        return await ctx.db.fees.update({
          where: { feeId },
          data: updateData,
        });
      } catch (error) {
        console.error("Error in updateFee:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({ code: "NOT_FOUND", message: "Fee not found." });
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update fee." });
      }
    }),

  deleteFeesByIds: publicProcedure
    .input(z.object({ feeIds: z.array(z.string()).min(1, "At least one fee ID is required") }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.fees.deleteMany({
          where: { feeId: { in: input.feeIds } },
        });
      } catch (error) {
        console.error("Error in deleteFeesByIds:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete fees." });
      }
    }),

  assignFeeToStudent: publicProcedure
    .input(
      z.object({
        studentClassId: z.string().min(1, "Student Class ID is required"),
        feeId: z.string().min(1, "Fee ID is required"),
        discount: z.number().min(0, "Discount must be a non-negative number"),
        discountbypercent: z.number().min(0).max(100, "Discount percentage must be between 0 and 100"),
        discountDescription: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if the studentClass and fee exist
        const studentClass = await ctx.db.studentClass.findUnique({
          where: { scId: input.studentClassId },
        });
        const fee = await ctx.db.fees.findUnique({
          where: { feeId: input.feeId },
        });

        if (!studentClass) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Student Class not found." });
        }
        if (!fee) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Fee not found." });
        }

        return await ctx.db.feeStudentClass.create({
          data: {
            studentClass: { connect: { scId: input.studentClassId } },
            fee: { connect: { feeId: input.feeId } },
            discount: input.discount,
            discountbypercent: input.discountbypercent,
            discountDescription: input.discountDescription,
          },
        });
      } catch (error) {
        console.error("Error in assignFeeToStudent:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "This fee is already assigned to the student.",
            });
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to assign fee to student." });
      }
    }),

  getStudentFees: publicProcedure
    .input(z.object({ studentClassId: z.string().min(1, "Student Class ID is required") }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.feeStudentClass.findMany({
          where: { studentClassId: input.studentClassId },
          include: { fee: true, studentClass: { include: { student: true, class: true } } },
        });
      } catch (error) {
        console.error("Error in getStudentFees:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve student fees." });
      }
    }),

  updateFeeAssignment: publicProcedure
    .input(
      z.object({
        sfcId: z.string().min(1, "Fee Student Class ID is required"),
        discount: z.number().min(0, "Discount must be a non-negative number").optional(),
        discountbypercent: z.number().min(0).max(100, "Discount percentage must be between 0 and 100").optional(),
        discountDescription: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { sfcId, ...updateData } = input;
        return await ctx.db.feeStudentClass.update({
          where: { sfcId },
          data: updateData,
        });
      } catch (error) {
        console.error("Error in updateFeeAssignment:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({ code: "NOT_FOUND", message: "Fee assignment not found." });
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update fee assignment." });
      }
    }),

  removeFeeAssignment: publicProcedure
    .input(z.object({ sfcId: z.string().min(1, "Fee Student Class ID is required") }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.feeStudentClass.delete({
          where: { sfcId: input.sfcId },
        });
      } catch (error) {
        console.error("Error in removeFeeAssignment:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({ code: "NOT_FOUND", message: "Fee assignment not found." });
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to remove fee assignment." });
      }
    }),

  getFeesByClass: publicProcedure
    .input(z.object({ classId: z.string().min(1, "Class ID is required") }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.feeStudentClass.findMany({
          where: { studentClass: { classId: input.classId } },
          include: { fee: true, studentClass: { include: { student: true, class: true } } },
        });
      } catch (error) {
        console.error("Error in getFeesByClass:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve fees for the class." });
      }
    }),

  getFeesBySession: publicProcedure
    .input(z.object({ sessionId: z.string().min(1, "Session ID is required") }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.feeStudentClass.findMany({
          where: { studentClass: { sessionId: input.sessionId } },
          include: { fee: true, studentClass: { include: { student: true, class: true } } },
        });
      } catch (error) {
        console.error("Error in getFeesBySession:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve fees for the session." });
      }
    }),
});

