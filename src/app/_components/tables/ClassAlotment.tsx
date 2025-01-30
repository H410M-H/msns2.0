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
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/trpc/react";
import Link from "next/link";
import FeeAllotmentDialog from "../forms/fee/FeeAllot";
import { AllotmentDialog } from "../forms/class/StudentAlotment";
import { SubjectAssignmentDialog } from "../forms/class/SubjectAssignment";
import { ReloadIcon } from "@radix-ui/react-icons";
import { SubjectDeletionDialog } from "../forms/class/SubjectDeletion";
import { SubjectCreationDialog } from "../forms/class/SubjectCreation";

type ClassStudentProps = {
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
};

const columns: ColumnDef<ClassStudentProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
      <div className="font-medium">{row.getValue("student.studentName")}</div>
    ),
  },
  {
    accessorKey: "student.fatherName",
    header: "Father Name",
    cell: ({ row }) => (
      <div className="text-gray-600">{row.getValue("student.fatherName")}</div>
    ),
  },
  {
    accessorKey: "class.grade",
    header: "Class",
    cell: ({ row }) => (
      <span className="rounded bg-blue-100 px-2 py-1 text-blue-800">
        {row.getValue("class.grade")}
      </span>
    ),
  },
  {
    accessorKey: "session.sessionName",
    header: "Session",
    cell: ({ row }) => (
      <div className="text-gray-600">{row.getValue("session.sessionName")}</div>
    ),
  },
  {
    accessorKey: "class.fee",
    header: "Monthly Fee",
    cell: ({ row }) => (
      <div className="font-medium">
        Rs. {row.getValue<number>("class.fee").toLocaleString()}
      </div>
    ),
  },
];

export const ClassAlotmentTable = ({
  classId,
  sessionId,
}: {
  classId: string;
  sessionId: string;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<ClassStudentProps[]>([]);

  // Queries
  const students = api.alotment.getStudentsInClass.useQuery({ classId });
  const subjects = api.subject.getSubjectsByClass.useQuery({
    classId,
    sessionId,
  });

  // Mutations
  const utils = api.useUtils();
  const refreshData = async () => {
    await Promise.all([utils.alotment.invalidate(), utils.subject.invalidate()]);
  };

  useEffect(() => {
    if (students.data) {
      const transformedData = students.data.map((item) => ({
        ...item,
        student: {
          ...item.student,
          guardianName: item.student.guardianName ?? "",
        },
        employee: {
          ...item.employee,
          employeeName: item.employee.employeeName ?? "",
        },
      }));
      setData(transformedData as unknown as ClassStudentProps[]);
    }
  }, [students.data]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold">Class Management</h2>
          <p className="text-gray-600">Class ID: {classId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={refreshData} variant="outline">
            <ReloadIcon className="mr-2 h-4 w-4" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Subjects Section */}
      <div className="my-6 rounded-lg border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Class Subjects</h3>
          <SubjectCreationDialog classId={classId} />
          <SubjectAssignmentDialog classId={classId} />
        </div>
        
        {subjects.data?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.data.map((subject) => (
              <div
                key={subject.csId}
                className="rounded border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{subject.subject.subjectName}</h4>
                  <span className="text-sm text-gray-500">
                    {subject.subject.book}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Taught by: {subject.employee.employeeName}
                </p>
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <SubjectDeletionDialog csId={subject.csId} classId={subject.classId} sessionId={subject.sessionId} />

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No subjects assigned to this class
          </div>
        )}
      </div>

      {/* Students Section */}
      <div className="my-6 rounded-lg border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Enrolled Students</h3>
          <div className="flex gap-2">
            <AllotmentDialog classId={classId} />
            <Button
              variant="destructive"
              disabled={!table.getFilteredSelectedRowModel().rows.length}
            >
              Remove Selected
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-col justify-between rounded-md border bg-gradient-to-r from-blue-50 to-purple-50 p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Select row"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {row.original.student.studentName}
                    </h3>
                  </div>
                  <span className="rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {row.original.class.grade}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Father: {row.original.student.fatherName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Contact: {row.original.student.studentMobile}
                  </p>
                </div>

                <div className="mt-4 flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500 text-white hover:bg-green-600"
                    asChild
                  >
                    <Link
                      href={`/students/${row.original.student.studentId}`}
                    >
                      Profile
                    </Link>
                  </Button>
                  <FeeAllotmentDialog
                    studentClassId={classId}
                    feeId={classId}
                    sfcId=""
                    initialDiscount={0}
                    initialDiscountPercent={0}
                    initialDiscountDescription=""
                    onUpdate={() => refreshData()}
                    onRemove={() => refreshData()}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-4 text-center text-gray-500">
              No students enrolled in this class
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-gray-600">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} selected
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};