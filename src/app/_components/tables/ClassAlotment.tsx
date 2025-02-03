"use client";

import {
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/trpc/react";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";
import { SubjectCreationDialog } from "../forms/class/SubjectCreation";
import { SubjectAssignmentDialog } from "../forms/class/SubjectAssignment";
import { SubjectDeletionDialog } from "../forms/class/SubjectDeletion";
import { AllotmentDialog } from "../forms/class/StudentAlotment";
import FeeAllotmentDialog from "../forms/fee/FeeAllot";

interface ClassStudentProps {
  student: {
    studentId: string;
    registrationNumber: string;
    studentMobile: string;
    fatherMobile: string;
    guardianName?: string | null;
    studentName: string;
    fatherName: string;
  };
  employee: {
    employeeId: string;
    registrationNumber: string;
    designation: string;
    cnic: string;
    employeeName?: string | null;
  };
  class: {
    grade: string;
    fee: number;
    classId: string;
  };
  session: {
    sessionName: string;
    sessionId: string;
  };
}

const classColors: Record<string, string> = {
  "1": "bg-blue-100 text-blue-800",
  "2": "bg-green-100 text-green-800",
  "3": "bg-purple-100 text-purple-800",
};

const columns: ColumnDef<ClassStudentProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "student.studentName",
    header: "Student Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.student.studentName}
      </div>
    ),
  },
  {
    accessorKey: "student.fatherName",
    header: "Father Name",
    cell: ({ row }) => (
      <div className="text-gray-600">
        {row.original.student.fatherName}
      </div>
    ),
  },
  {
    accessorKey: "class.grade",
    header: "Class",
    cell: ({ row }) => (
      <span className="rounded bg-blue-100 px-2 py-1 text-blue-800">
        {row.original.class.grade}
      </span>
    ),
  },
  {
    accessorKey: "session.sessionName",
    header: "Session",
    cell: ({ row }) => (
      <div className="text-gray-600">
        {row.original.session.sessionName}
      </div>
    ),
  },
  {
    accessorKey: "class.fee",
    header: "Monthly Fee",
    cell: ({ row }) => (
      <div className="font-medium">
        Rs. {row.original.class.fee.toLocaleString()}
      </div>
    ),
  },
];

export const ClassAllotmentTable = ({
  classId,
  sessionId,
}: {
  classId: string;
  sessionId: string;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<ClassStudentProps[]>([]);

  const { data: students, isLoading: studentsLoading } = 
    api.alotment.getStudentsInClass.useQuery({ classId });
  const { data: subjects, isLoading: subjectsLoading } = 
    api.subject.getSubjectsByClass.useQuery({ classId, sessionId });

  const utils = api.useUtils();
  const refreshData = async () => {
    await Promise.all([utils.alotment.invalidate(), utils.subject.invalidate()]);
  };

  const transformedData = useMemo(() => {
    return students?.map(item => ({
      ...item,
      student: { ...item.student, guardianName: item.student.guardianName ?? "" },
      employee: { ...item.employee, employeeName: item.employee.employeeName ?? "" },
    })) ?? [];
  }, [students]);

  useEffect(() => {
    setData(transformedData as ClassStudentProps[]);
  }, [transformedData]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { sorting, rowSelection },
  });

  return (
    <div className="w-full space-y-6 p-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Grade Dashboard
          </h1>
          <div className="mt-2 flex gap-2">
            <span className="rounded-lg bg-white px-3 py-1 text-sm shadow-sm">
              📚 {subjects?.length ?? 0} Subjects
            </span>
            <span className="rounded-lg bg-white px-3 py-1 text-sm shadow-sm">
              👥 {students?.length ?? 0} Students
            </span>
          </div>
        </div>
        <AllotmentDialog classId={classId} />
        <Button 
          onClick={refreshData} 
          variant="outline"
          className="gap-2 bg-white hover:bg-gray-50"
        >
          <ReloadIcon className={`h-4 w-4 ${studentsLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Subjects Section */}
      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Class Subjects</h2>
          <div className="flex gap-2">
            <SubjectCreationDialog classId={classId} />
            <SubjectAssignmentDialog classId={classId} />
          </div>
        </div>
        
        {subjectsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading subjects...</div>
        ) : subjects?.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjects.map((subject) => (
              <div
                key={subject.csId}
                className="group relative rounded-lg border bg-white p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {subject.subject.subjectName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      📖 {subject.subject.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {subject.employee.employeeName}
                  </span>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <SubjectDeletionDialog 
                    csId={subject.csId} 
                    classId={subject.classId} 
                    sessionId={subject.sessionId} 
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
            <p className="text-gray-500">No subjects assigned yet</p>
          </div>
        )}
      </section>

      {/* Students Section */}
      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Enrolled Students</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="destructive"
              disabled={!table.getFilteredSelectedRowModel().rows.length}
              className="gap-2"
            >
              🗑️ Remove Selected
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {studentsLoading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Loading students...
            </div>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="group relative rounded-lg border bg-white p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {row.original.student.studentName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        👨 {row.original.student.fatherName}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    classColors[row.original.class.grade] ?? 'bg-gray-100 text-gray-800'
                  }`}>
                    {row.original.class.grade}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full gap-2 text-sm"
                  >
                    <Link href={`/students/${row.original.student.studentId}`}>
                      👤 Profile
                    </Link>
                  </Button>
                  <FeeAllotmentDialog
                    studentClassId={classId}
                    feeId={classId}
                    sfcId=""
                    initialDiscount={0}
                    initialDiscountPercent={0}
                    initialDiscountDescription=""
                    onUpdate={refreshData}
                    onRemove={refreshData}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
              <p className="text-gray-500">No students enrolled yet</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-gray-600">
            Selected {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};