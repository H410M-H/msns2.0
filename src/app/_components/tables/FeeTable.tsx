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
  type ColumnSort,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { DollarSign, RefreshCw, Search } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { FeeCreationDialog } from "../forms/fee/FeeCreation";
import { FeeAssignmentDialog } from "../forms/fee/feeAssignment";
import { FeeDeletionDialog } from "../forms/fee/FeeDeletion";

type FeeProps = {
  feeId: string;
  level: string;
  admissionFee: number;
  tuitionFee: number;
  examFund: number;
  computerLabFund: number | null;
  studentIdCardFee: number;
  infoAndCallsFee: number;
  createdAt: Date;
  type: string;
};

const columns: ColumnDef<FeeProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    accessorKey: "admissionFee",
    header: "Admission Fee",
    cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
  },
  {
    id: "tuitionFee",
    header: "Monthly Fee",
    cell: ({ row }) => {
      const monthlyFee = row.original.tuitionFee;
      return `Rs. ${monthlyFee.toLocaleString()}`;
    },
  },
  {
    accessorKey: "examFund",
    header: "Exam Fund",
    cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
  },
  {
    accessorKey: "computerLabFund",
    header: "Computer Lab Fund",
    cell: ({ getValue }) => {
      const value = getValue() as number | null;
      return value ? `Rs. ${value.toLocaleString()}` : "N/A";
    },
  },
  {
    accessorKey: "studentIdCardFee",
    header: "ID Card Fee",
    cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
  },
  {
    accessorKey: "infoAndCallsFee",
    header: "Info & Calls Fee",
    cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
  },
  {
    id: "annualFee",
    header: "Annual Fee",
    cell: ({ row }) => {
      const annualFee =
        row.original.admissionFee +
        row.original.examFund +
        (row.original.computerLabFund ?? 0) +
        row.original.studentIdCardFee +
        row.original.infoAndCallsFee;
      return `Rs. ${annualFee.toLocaleString()}`;
    },
  },
  {
    id: "totalFee",
    header: "Total Fee",
    cell: ({ row }) => {
      const annualFee =
        row.original.admissionFee +
        row.original.examFund +
        (row.original.computerLabFund ?? 0) +
        row.original.studentIdCardFee +
        row.original.infoAndCallsFee;
      const totalFee = row.original.tuitionFee + annualFee;
      return `Rs. ${totalFee.toLocaleString()}`;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => format(getValue() as Date, "dd-MM-yyyy HH:mm:ss"),
  },
];

export function FeeTable() {
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Added isLoading to query hook
  const { data: fees, refetch, isLoading } = api.fee.getAllFees.useQuery();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleDeleteSuccess = () => {
    void refetch();
    setRowSelection({});
  };

  const table = useReactTable({
    data: fees ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const selectedFeeIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.feeId);

  const totalFeesByClass = useMemo(() => {
    if (!fees) return {};
    return fees.reduce((acc, fee) => {
      const totalFee =
        fee.tuitionFee +
        fee.admissionFee +
        fee.examFund +
        (fee.computerLabFund ?? 0) +
        fee.studentIdCardFee +
        fee.infoAndCallsFee;
      acc[fee.level] = (acc[fee.level] ?? 0) + totalFee;
      return acc;
    }, {} as Record<string, number>);
  }, [fees]);

  return (
<div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-md">
  {/* Header Section */}
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div className="space-y-1">
      <h1 className="text-3xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
        Fee Management
      </h1>
      <p className="text-sm text-gray-600">Manage fee structures and view financial summaries</p>
    </div>
    
    {/* Action Bar */}
    <div className="flex flex-col sm:flex-row gap-3 items-center">
      <div className="relative flex-1 w-full sm:w-auto">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search fees..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(String(e.target.value))}
          className="pl-8 bg-white w-full sm:w-64 focus:ring-2 focus:ring-blue-500 rounded-lg shadow-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <FeeCreationDialog />
        <FeeDeletionDialog feeIds={selectedFeeIds} onDeleteSuccess={handleDeleteSuccess} />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="text-gray-600 hover:bg-blue-100 transition-colors rounded-lg"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    <FeeAssignmentDialog />
    </div>
  </div>

  {/* Summary Cards */}
  <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-12">
    {Object.entries(totalFeesByClass).map(([level, totalFee]) => (
      <div
        key={level}
        className="bg-white p-2 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">{level}</span>
        </div>
        <div className="mt-3">
          <p className="text-md font-bold text-green-900">{totalFee.toLocaleString()}/-</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-serif text-gray-500">Annual Fee</span>
            <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center shadow-sm">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Table Section */}
  <div className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <Table className="min-w-[1000px]">
        <TableHeader className="bg-gray-50 border-b border-gray-200 sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-gray-50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-6 py-4 font-semibold text-gray-700">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <TableRow key={i} className="even:bg-gray-50">
                {columns.map((_, j) => (
                  <TableCell key={j} className="px-6 py-4">
                    <Skeleton className="h-4 w-full animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors even:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-6 py-4 text-sm text-gray-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                <p className="text-gray-600">No fee records found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>

  <div className="flex flex-col sm:flex-row items-center justify-between px-4 gap-4">
    <div className="text-sm text-gray-600">
      Showing{" "}
      <span className="font-semibold">{table.getRowModel().rows.length}</span> of{" "}
      <span className="font-semibold">{fees?.length}</span> results
    </div>
    
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Previous
      </Button>
      <div className="flex items-center gap-1">
        {Array.from({ length: table.getPageCount() }, (_, i) => (
          <Button
            key={i}
            variant="ghost"
            size="sm"
            onClick={() => table.setPageIndex(i)}
            className={`w-8 h-8 ${
              table.getState().pagination.pageIndex === i
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Next
      </Button>
    </div>
  </div>
</div>
  );
}