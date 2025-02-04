"use client";

import { useState, useMemo, useEffect } from "react";
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
import { ArrowUpDown, Download, RefreshCw } from "lucide-react";
import FeeAllotmentDialog from "../forms/fee/FeeAllot";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";

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
    computerLabFund?: number | null;
    studentIdCardFee: number;
    infoAndCallsFee: number;
    admissionFee: number;
    type?: string;
    level?: string;
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

  const { data: classFees, isLoading, isError, refetch } = 
  api.fee.getFeeAssignmentsByClassAndSession.useQuery(
    { classId, sessionId },
    { refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load fee assignments");
    }
  }, [isError]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const columns: ColumnDef<ClassFeeProps>[] = [
    {
      accessorKey: "studentClass.student.registrationNumber",
      header: "Reg. No.",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.studentClass.student.registrationNumber}
        </Badge>
      ),
    },
    {
      accessorKey: "studentClass.student.studentName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "studentClass.class.grade",
      header: "Class",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.studentClass.class.grade} -{" "}
          {row.original.studentClass.class.section}
        </div>
      ),
    },
    {
      id: "feeBreakdown",
      header: "Fee Breakdown",
      cell: ({ row }) => {
        const fee = row.original.fee;
        return (
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tuition:</span>
              <span>Rs. {fee.tuitionFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annual:</span>
              <span>
                Rs.{" "}
                {(fee.examFund +
                  (fee.computerLabFund ?? 0) +
                  fee.studentIdCardFee +
                  fee.infoAndCallsFee).toLocaleString()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "totalFee",
      header: "Total Fee",
      cell: ({ row }) => {
        const fee = row.original.fee;
        const total = calculateTotalFee(fee as FeeProps);
        return (
          <div className="font-semibold">
            Rs. {total.toLocaleString()}
            {row.original.discount > 0 && (
              <span className="block text-xs text-red-500">
                - Rs. {row.original.discount.toLocaleString()}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "discount",
      header: "Discount",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">
            {row.original.discountByPercent}%
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.discountDescription}
          </div>
        </div>
      ),
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
      return total + calculateTotalFee(classFee.fee) - classFee.discount;
    }, 0);
  }, [classFees]);

  function calculateTotalFee(fee: FeeProps) {
    return (
      fee.tuitionFee +
      fee.examFund +
      (fee.computerLabFund ?? 0) +
      fee.studentIdCardFee +
      fee.infoAndCallsFee +
      fee.admissionFee
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
        Failed to load fee data. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search students..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.promise(generateFeeReport(), {
              loading: "Generating report...",
              success: "Report generated!",
              error: "Failed to generate report"
            })}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading || isRefreshing ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-24">
                  No fee assignments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{" "}
          {classFees?.length} students
        </div>
        {totalFeeForClass !== undefined && (
          <div className="space-y-1 text-right">
            <div className="font-semibold">
              Total Net Fee: Rs. {totalFeeForClass.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              (After applying all discounts)
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
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
  );
}

// Helper function to generate report
async function generateFeeReport() {
  const response = api.fee.generateFeeReport.useQuery();
  if (response.data?.pdf) {
    const blob = new Blob([Uint8Array.from(response.data.pdf)], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'fee-report.pdf';
    link.click();
  }
}
