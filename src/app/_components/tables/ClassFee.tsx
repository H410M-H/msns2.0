"use client";

import { useState, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import FeeAllotmentDialog from "../forms/fee/FeeAllot";

// Define the structure of the data
type ClassFeeProps = {
  sfcId: string;
  studentClassId: string;
  feeId: string;
  discount: number;
  discountByPercent: number;
  discountDescription: string;
  createdAt: Date;
  updatedAt: Date;
  fee: {
    tuitionFee: number;
    examFund: number;
    computerLabFund: number | null;
    studentIdCardFee: number;
    infoAndCallsFee: number;
    admissionFee: number;
  };
  studentClass: {
    student: {
      studentId: string;
      registrationNumber: string;
      studentName: string;
    };
    class: {
      grade: string;
      section: string;
    };
  };
};

interface ClassFeeTableProps {
  classId: string;
  sessionId: string;
}

export function ClassFeeTable({ classId, sessionId }: ClassFeeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: classFees, refetch } = api.fee.getFeeAssignmentsByClassAndSession.useQuery(
    { classId, sessionId },
    { refetchOnWindowFocus: false }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const columns: ColumnDef<ClassFeeProps>[] = [
    {
      accessorKey: "studentClass.student.registrationNumber",
      header: "Registration No.",
    },
    {
      accessorKey: "studentClass.student.studentName",
      header: "Student Name",
    },
    {
      accessorKey: "studentClass.class.grade",
      header: "Class",
      cell: ({ row }) =>
        `${row.original.studentClass.class.grade} - ${row.original.studentClass.class.section}`,
    },
    {
      accessorKey: "fee.tuitionFee",
      header: "Tuition Fee",
      cell: ({ getValue }) => `Rs. ${getValue<number>().toLocaleString()}`,
    },
    {
      id: "annualFee",
      header: "Annual Fee",
      cell: ({ row }) => {
        const fee = row.original.fee;
        const annualFee =
          fee.examFund +
          (fee.computerLabFund ?? 0) +
          fee.studentIdCardFee +
          fee.infoAndCallsFee;
        return `Rs. ${annualFee.toLocaleString()}`;
      },
    },
    {
      id: "totalFee",
      header: "Total Fee",
      cell: ({ row }) => {
        const fee = row.original.fee;
        const totalFee =
          fee.tuitionFee +
          fee.examFund +
          (fee.computerLabFund ?? 0) +
          fee.studentIdCardFee +
          fee.infoAndCallsFee +
          fee.admissionFee;
        return `Rs. ${totalFee.toLocaleString()}`;
      },
    },
    {
      accessorKey: "discount",
      header: "Discount",
      cell: ({ getValue }) => `Rs. ${getValue<number>().toLocaleString()}`,
    },
    {
      accessorKey: "discountByPercent",
      header: "Discount %",
      cell: ({ getValue }) => `${getValue<number>().toFixed(2)}%`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <FeeAllotmentDialog
          sfcId={row.original.sfcId}
          studentClassId={row.original.studentClassId}
          feeId={row.original.feeId}
          initialDiscount={row.original.discount}
          initialDiscountPercent={row.original.discountByPercent}
          initialDiscountDescription={row.original.discountDescription}
          onUpdate={handleRefresh}
          onRemove={handleRefresh}
                  />
      ),
    },
  ];

  const table = useReactTable({
    data: classFees ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  const totalFeeForClass = useMemo(() => {
    return classFees?.reduce((total, classFee) => {
      const fee = classFee.fee;
      return (
        total +
        fee.tuitionFee +
        fee.examFund +
        (fee.computerLabFund ?? 0) +
        fee.studentIdCardFee +
        fee.infoAndCallsFee +
        fee.admissionFee
      );
    }, 0);
  }, [classFees]);

  return (
    <div className="space-y-4 p-4">
      {/* Search and Refresh */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search fees..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          className={`bg-blue-500 text-white hover:bg-blue-600 ${
            isRefreshing ? "animate-pulse" : ""
          }`}
          onClick={handleRefresh}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Fee Table */}
      <div className="rounded-md border shadow-md overflow-hidden">
        <Table className="bg-gray-50 w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No fees assigned to students in this class.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Total Fee */}
      {totalFeeForClass !== undefined && (
        <div className="text-right font-semibold">
          Total Fee for Class: Rs. {totalFeeForClass.toLocaleString()}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
