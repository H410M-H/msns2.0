// src/server/api/routers/report.router.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generatePdf } from "~/lib/utils/pdf-reports";

const reportTypeSchema = z.enum([
  'students',
  'employees',
  'classes',
  'subjects'
]);

export const ReportRouter = createTRPCRouter({
  generateReport: publicProcedure
    .input(z.object({ reportType: reportTypeSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { reportType } = input;
        const title = `${reportType} Report`;

        let data: Array<Record<string, unknown>> = [];
        const headers: string[] = [];

        switch (reportType) {
          case 'students':
            data = await ctx.db.students.findMany({
              select: {
                studentId: true,
                studentName: true,
                registrationNumber: true,
                admissionNumber: true,
                dateOfBirth: true,
                gender: true,
                fatherName: true,
                studentMobile: true,
                isAssign: true
              }
            });
            headers.push(
              'studentId',
              'studentName',
              'registrationNumber',
              'admissionNumber',
              'Date of Birth',
              'Gender',
              'Father Name',
              'Contact',
              'Status'
            );
            break;

          case 'employees':
            data = await ctx.db.employees.findMany({
              select: {
                employeeId: true,
                employeeName: true,
                designation: true,
              }
            });
            headers.push(
              'Employee ID',
              'Name',
              'Designation',
              'Salary',
              'Contact',
              'Join Date'
            );
            break;

          default:
            throw new Error('Invalid report type');
        }

        const pdfData = await generatePdf(data, headers, title);
        return { pdf: pdfData };
      } catch (error) {
        console.error('Report generation failed:', error);
        throw new Error('Failed to generate report');
      }
    }),
});