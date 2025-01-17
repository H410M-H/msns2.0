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
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnSort,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { FeeCreationDialog } from "../forms/fee/FeeCreation";
import { FeeDeletionDialog } from "../forms/fee/FeeDeletion";
import { RefreshCw } from "lucide-react";
import { FeeAssignmentDialog } from "../forms/fee/feeAssignment";

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

  const table = useReactTable({
    data: fees ?? [],
    columns: [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(!!e.target.checked)}
          />
        ),
      },
      {
        accessorKey: "feeName",
        header: "Fee Name",
      },
      {
        accessorKey: "tuition",
        header: "Tuition",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return format(date, "dd-MM-yyyy | HH:mm:ss");
        },
      },
    ],
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

  const selectedFeeIds = table.getSelectedRowModel().rows.map(
    (row) => row.original.feeId
  );

  return (
    <div className="space-y-4 p-4">
      {/* Search and Actions */}
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
                isRefreshing ? 'animate-pulse' : ''
              }`}
              onClick={handleRefresh}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          <FeeCreationDialog />
                <FeeAssignmentDialog />
          <FeeDeletionDialog feeIds={selectedFeeIds} onDeleteSuccess={function (): void {
            throw new Error("Function not implemented.");
          } } />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border shadow-md">
        <Table className="min-w-full">
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No fees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
