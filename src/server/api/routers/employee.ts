import { TRPCError } from "@trpc/server"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { z } from "zod"

const employeeSchema = z.object({
  employeeName: z.string(),
  fatherName: z
    .string(),
  gender: z.enum(["MALE", "FEMALE"]),
  dob: z.string(),
  cnic: z.string(),
  maritalStatus: z.enum(["Married", "Unmarried", "Widow", "Divorced"]),
  doj: z.string(),
  designation: z.enum(["Principal", "Admin", "Head", "Clerk", "Teacher", "Worker"]),
  residentialAddress: z.string(),
  mobileNo: z.string(),
  additionalContact: z.string().optional(),
  education: z.string(),
  profilePic: z.string().optional(),
  cv: z.string().optional(),
})

export const EmployeeRouter = createTRPCRouter({
  getEmployees: publicProcedure.query(async ({ ctx }) => {
    try {
      const employees = await ctx.db.employees.findMany()
      return employees
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong.",
      })
    }
  }),

  createEmployee: publicProcedure.input(employeeSchema).mutation(async ({ ctx, input }) => {
    try {
      const newEmployee = await ctx.db.employees.create({
        data: {
          ...input,
          additionalContact: input.additionalContact ?? null,
        },
      })
      return newEmployee
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      })
    }
  }),

  deleteEmployeesByIds: publicProcedure
    .input(
      z.object({
        employeeIds: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.employees.deleteMany({
          where: {
            employeeId: {
              in: input.employeeIds,
            },
          },
        })
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        })
      }
    }),

  getEmployeesByDesignation: publicProcedure
    .input(
      z.object({
        designation: z.enum(["Principal", "Admin", "Head", "Clerk", "Teacher", "Worker"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.employees.findMany({
          where: {
            designation: input.designation,
          },
        })
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        })
      }
    }),
})

