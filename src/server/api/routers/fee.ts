import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { FeeCategory, type fees as PrismaClass } from "@prisma/client";


type FeeProps = PrismaClass;

export const FeeRouter = createTRPCRouter({
  getFees: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.fees.findMany();
    } catch (error) {
      console.error("Error in getFees:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve classes." });
    }
  }),

  getGroupedFee: publicProcedure.query(async ({ ctx }) => {
    try {
      const fees = await ctx.db.fees.findMany();
      const getGroupedFees: Record<FeeCategory, FeeProps[]> = {
        MonthlyFee: [],
        AnnualFee: [],
      };

      fees.forEach((feesData) => {
        getGroupedFees[feesData.type]?.push(feesData);
      });

      return getGroupedFees;
    } catch (error) {
      console.error("Error in getGroupedFees:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve grouped classes." });
    }
  }),

  createFee: publicProcedure
    .input(
      z.object({
        feeName: z.string(),
        tuition: z.number().min(0),
        type: z.nativeEnum(FeeCategory),
        fee: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.fees.create({
          data: input,
        });
      } catch (error) {
        console.error("Error in createFees:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create class." });
      }
    }),

  deleteFeesByIds: publicProcedure
    .input(z.object({ feeIds: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.fees.deleteMany({
          where: { feeId: { in: input.feeIds } },
        });
      } catch (error) {
        console.error("Error in deleteFeesByIds:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete classes." });
      }
    }),
});
