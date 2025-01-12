"use client";

import { useState } from "react";
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
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { FeeAllotmentDialog } from "../forms/fee/FeeAllot";
import { type FeeCategory } from "@prisma/client";

// Define the type for the props used in the table
type ClassFeeProps = {
  fee: {
    feeId: string;
    type: FeeCategory;
    createdAt: Date;
    updatedAt: Date;
    feeName: string;
    tuition: number;
  };
  feeId: string;
  createdAt: Date;
  updatedAt: Date;
  scId: string; // Student class ID
  studentClassId: string;
  discount: number;
  discountbypercent: number;
  discountDescription: string;
  sfcId: string;
};

// Define the component's props
type ClassFeeTableProps = {
  classId: string;
  sessionId: string;
};

// Define the column configuration
const columns: ColumnDef<ClassFeeProps>[] = [
  {
    accessorKey: "fee.feeName",
    header: "Fee Name",
  },
  {
    accessorKey: "fee.tuition",
    header: "Tuition",
    cell: ({ row }) => <div>{row.getValue<number>("fee.tuition").toFixed(2)}</div>,
  },
  {
    accessorKey: "fee.type",
    header: "Fee Type",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <FeeAllotmentDialog
        studentClassId={row.original.scId}
        feeId={row.original.fee.feeId}
        onAllotmentSuccess={() => {
          console.log("Allotment successful!");
        }}
      />
    ),
  },
];

// Define the table component
export function ClassFeeTable({ classId }: ClassFeeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: classFees } = api.fee.getStudentFees.useQuery<ClassFeeProps[]>({
    studentClassId: classId,
  });

  const table = useReactTable<ClassFeeProps>({
    data: classFees ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search students..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
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
                  No fees assigned to students in this class.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
