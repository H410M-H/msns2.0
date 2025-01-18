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
import { RefreshCw } from 'lucide-react';
import { FeeAssignmentDialog } from "../forms/fee/feeAssignment";
import { FeeCreationDialog } from "../forms/fee/FeeCreation";
import { FeeDeletionDialog } from "../forms/fee/FeeDeletion";

type Fee = {
  feeId: string;
  level: string;
  admissionFee: number;
  tuitionFee: number;
  examFund: number;
  computerLabFund: number | null;
  studentIdCardFee: number;
  infoAndCallsFee: number;
  createdAt: Date;
};

const columns: ColumnDef<Fee>[] = [
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
    accessorKey: "tuitionFee",
    header: "Monthly Fee",
    cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
  },
  {
    accessorKey: "examFund",
    header: "Exam Fund (Annual)",
    cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
  },
  {
    accessorKey: "computerLabFund",
    header: "Computer Lab Fund (Annual)",
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

  const { data: fees, refetch } = api.fee.getAllFees.useQuery();

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

  const totals = useMemo(() => {
    if (!fees) return { monthlyTotal: 0, annualTotal: 0 };
    return fees.reduce(
      (acc, fee) => {
        acc.monthlyTotal += fee.tuitionFee;
        acc.annualTotal +=
          fee.examFund +
          (fee.computerLabFund ?? 0) +
          fee.studentIdCardFee +
          fee.infoAndCallsFee;
        return acc;
      },
      { monthlyTotal: 0, annualTotal: 0 }
    );
  }, [fees]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Search fees..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className={`bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ${
              isRefreshing ? "animate-pulse" : ""
            }`}
            onClick={handleRefresh}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <FeeCreationDialog />
          <FeeAssignmentDialog />
          <FeeDeletionDialog
            feeIds={selectedFeeIds}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      </div>

      <div className="rounded-md border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-100 transition-colors"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No fees found.
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="font-bold bg-gray-100">
                <TableCell colSpan={3}>Totals</TableCell>
                <TableCell>Rs. {totals.monthlyTotal.toLocaleString()}</TableCell>
                <TableCell colSpan={4}>
                  Rs. {totals.annualTotal.toLocaleString()}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
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

