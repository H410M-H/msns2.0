import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

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
        feeName: z.string(),
        tuition: z.number().min(0),
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
        feeId: z.string(),
        feeName: z.string().optional(),
        tuition: z.number().min(0).optional(),
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
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update fee." });
      }
    }),

  deleteFeesByIds: publicProcedure
    .input(z.object({ feeIds: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.fees.deleteMany({
          where: { feeId: input.feeIds },
        });
      } catch (error) {
        console.error("Error in deleteFee:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete fee." });
      }
    }),

  assignFeeToStudent: publicProcedure
    .input(
      z.object({
        studentClassId: z.string(),
        feeId: z.string(),
        discount: z.number().min(0),
        discountbypercent: z.number().min(0).max(100),
        discountDescription: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.feeStudentClass.create({
          data: input,
        });
      } catch (error) {
        console.error("Error in assignFeeToStudent:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to assign fee to student. Please check the provided data.",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to assign fee to student." });
      }
    }),

  getStudentFees: publicProcedure
    .input(z.object({ studentClassId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.feeStudentClass.findMany({
          where: { studentClassId: input.studentClassId },
          include: { fee: true },
        });
      } catch (error) {
        console.error("Error in getStudentFees:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve student fees." });
      }
    }),

  updateFeeAssignment: publicProcedure
    .input(
      z.object({
        sfcId: z.string(),
        discount: z.number().min(0).optional(),
        discountbypercent: z.number().min(0).max(100).optional(),
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
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to update fee assignment. Please check the provided data.",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update fee assignment." });
      }
    }),

  removeFeeAssignment: publicProcedure
    .input(z.object({ sfcId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.feeStudentClass.delete({
          where: { sfcId: input.sfcId },
        });
      } catch (error) {
        console.error("Error in removeFeeAssignment:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to remove fee assignment. Please check the provided data.",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to remove fee assignment." });
      }
    }),
});

