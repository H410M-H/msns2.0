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
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/trpc/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { SessionDialog } from "../dialogs/SessionDetailDialog";
import SessionCreationDialog from "../forms/annualSession/SessionCreation";
import SessionDeletionDialog from "../forms/annualSession/SessionDeletion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link } from "lucide-react";

const columns: ColumnDef<SessionProps>[] = [
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
    accessorKey: "sessionName",
    header: "Session Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("sessionName")}</div>
    ),
  },
  {
    accessorKey: "SessionFrom",
    header: "Session Start Date",
    cell: ({ row }) => <div>{row.getValue("sessionFrom")}</div>,
  },
  {
    accessorKey: "sessionTo",
    header: "Session End Date",
    cell: ({ row }) => <div>{row.getValue("sessionTo")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-4 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/bicycle/product/${row.original.sessionId}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const SessionTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<SessionProps[]>([]);

  const sessionsData = api.session.getSessions.useQuery();

  useMemo(() => {
    if (sessionsData.data) setData(sessionsData.data);
  }, [sessionsData.data]);

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
      <div className="flex items-center justify-between gap-4 my-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => table.toggleAllRowsSelected()}
            variant="outline"
            className="bg-purple-500 text-white hover:bg-purple-600 px-4 py-2 rounded-md"
          >
            {table.getIsAllRowsSelected() ? "Deselect All" : "Select All"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <SessionCreationDialog />
          <Button
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
            onClick={() => sessionsData.refetch()}
          >
            Refresh
          </Button>
          <SessionDeletionDialog
            sessionIds={table
              .getSelectedRowModel()
              .rows.map((row) => row.original.sessionId)}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="rounded-lg border bg-gradient-to-r from-blue-200 to-purple-300 p-4 shadow-lg transition-transform transform hover:scale-105"
            >
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={row.id}>
                  <AccordionTrigger className="flex justify-between items-center p-4 rounded-lg bg-white shadow-md hover:bg-green-100 hover:no-underline">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select session"
                      />
                      <span className="text-gray-800 font-semibold text-lg">
                        {row.original.sessionName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 shadow-inner">
                        {row.original.sessionFrom}
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 shadow-inner">
                        {row.original.sessionTo}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white p-4 mt-2 rounded-md">
                    <SessionDialog sessionId={row.original.sessionId} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))
        ) : (
          <div className="col-span-full py-6 text-center text-gray-500">
            No results found.
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between py-4 px-6 bg-gray-100 border-t">
        <div className="text-sm text-gray-600">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-indigo-500 text-white hover:bg-indigo-600 px-3 py-1 rounded-md"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          </div>
          <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-indigo-500 text-white hover:bg-indigo-600 px-3 py-1 rounded-md"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          </div>
        </div>
      </div>
  );
};