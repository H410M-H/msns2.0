"use client";

import {
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Search, RefreshCw, ChevronDown } from 'lucide-react';
import { Checkbox } from "~/components/ui/checkbox";
import { ScrollArea } from "~/components/ui/scroll-area";

const categoryOrder = ["Montessori", "Primary", "Middle", "SSC_I", "SSC_II"];
const categoryColors: Record<string, string> = {
  Montessori: "from-red-100 to-red-200 text-red-800",
  Primary: "from-pink-100 to-pink-200 text-pink-800",
  Middle: "from-green-100 to-green-200 text-green-800",
  SSC_I: "from-yellow-100 to-yellow-200 text-yellow-800",
  SSC_II: "from-purple-100 to-purple-200 text-purple-800",
};

type FeeAssignmentProps = {
  sfcId: string;
  studentName: string;
  className: string;
  feeName: string;
  amount: number;
  discount: number;
  category: string;
};

type ComponentProps = {
  sessionId: string;
  feeId: string;
};

export const FeeAssignmentTable = ({}: ComponentProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<FeeAssignmentProps[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedAssignments, setSelectedAssignments] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const getStudentFees = api.fee.getStudentFees.useQuery({ studentClassId: "" });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getStudentFees.refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useMemo(() => {
    if (getStudentFees.data) {
      setData(getStudentFees.data as unknown as FeeAssignmentProps[]);
    }
  }, [getStudentFees.data]);
  const groupedData = useMemo(() => {
    const grouped: Record<string, FeeAssignmentProps[]> = {};
    data.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category]?.push(item);
    });
    return grouped;
  }, [data]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCategorySelect = (category: string) => {
    const newSelectedCategories = new Set(selectedCategories);
    const assignmentsInCategory = groupedData[category] ?? [];
    const newSelectedAssignments = new Set(selectedAssignments);

    if (selectedCategories.has(category)) {
      newSelectedCategories.delete(category);
      assignmentsInCategory.forEach(assignment => {
        newSelectedAssignments.delete(assignment.sfcId);
      });
    } else {
      newSelectedCategories.add(category);
      assignmentsInCategory.forEach(assignment => {
        newSelectedAssignments.add(assignment.sfcId);
      });
    }

    setSelectedCategories(newSelectedCategories);
    setSelectedAssignments(newSelectedAssignments);
  };

  const handleAssignmentSelect = (sfcId: string, category: string) => {
    const newSelectedAssignments = new Set(selectedAssignments);
    const newSelectedCategories = new Set(selectedCategories);

    if (selectedAssignments.has(sfcId)) {
      newSelectedAssignments.delete(sfcId);
      // Check if we need to unselect the category
      const allAssignmentsInCategory = groupedData[category] ?? [];
      const remainingSelectedAssignmentsInCategory = allAssignmentsInCategory.filter(assignment => 
        assignment.sfcId !== sfcId && newSelectedAssignments.has(assignment.sfcId)
      );
      if (remainingSelectedAssignmentsInCategory.length === 0) {
        newSelectedCategories.delete(category);
      }
    } else {
      newSelectedAssignments.add(sfcId);
      // Check if all assignments in category are selected
      const allAssignmentsInCategory = groupedData[category] ?? [];
      const allSelected = allAssignmentsInCategory.every(assignment => 
        newSelectedAssignments.has(assignment.sfcId) || assignment.sfcId === sfcId
      );
      if (allSelected) {
        newSelectedCategories.add(category);
      }
    }

    setSelectedAssignments(newSelectedAssignments);
    setSelectedCategories(newSelectedCategories);
  };

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: "studentName",
        header: "Student Name",
        cell: ({ row }) => <div>{row.getValue("studentName")}</div>,
      },
      {
        accessorKey: "className",
        header: "Class",
        cell: ({ row }) => <div>{row.getValue("className")}</div>,
      },
      {
        accessorKey: "feeName",
        header: "Fee Name",
        cell: ({ row }) => <div>{row.getValue("feeName")}</div>,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => <div>{row.getValue<number>("amount").toFixed(2)}</div>,
      },
      {
        accessorKey: "discount",
        header: "Discount",
        cell: ({ row }) => <div>{row.getValue<number>("discount").toFixed(2)}</div>,
      },
    ],
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
  });

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search student name..."
              value={(table.getColumn("studentName")?.getFilterValue() as string) ?? ""}
              onChange={(event) => {
                const column = table.getColumn("studentName");
                if (column) {
                  column.setFilterValue(event.target.value);
                }
              }}
              className="pl-10 border-2 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all duration-300"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {categoryOrder.map((category) => (
          <ScrollArea key={category} className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
            <div
              className={`w-full cursor-pointer bg-gradient-to-r p-4 ${categoryColors[category] ?? "from-gray-100 to-gray-200 text-gray-800"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedCategories.has(category)}
                    onCheckedChange={() => handleCategorySelect(category)}
                    className="h-5 w-5"
                  />
                  <h2 className="text-xl font-bold">{category}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCategory(category)}
                >
                  <ChevronDown
                    className={`h-5 w-5 transform transition-transform duration-300 ${
                      expandedCategories[category] ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </div>
            </div>
            
            <div className={`grid grid-cols-1 p-6 transition-all duration-300 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
              expandedCategories[category] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              {(groupedData[category] ?? []).map((assignment) => (
                <div
                  key={assignment.sfcId}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-indigo-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox
                        checked={selectedAssignments.has(assignment.sfcId)}
                        onCheckedChange={() => handleAssignmentSelect(assignment.sfcId, category)}
                        className="h-4 w-4"
                      />
                      <h3 className="text-lg font-bold text-gray-800">{assignment.studentName}</h3>
                    </div>
                    <p className="text-sm text-gray-600">Class: {assignment.className}</p>
                    <p className="text-sm text-gray-600">Fee: {assignment.feeName}</p>
                    <p className="mt-2 text-sm font-medium text-gray-600">
                      Amount: <span className="text-green-600">{assignment.amount.toFixed(2)}/-PKR</span>
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      Discount: <span className="text-red-600">{assignment.discount.toFixed(2)}/-PKR</span>
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-600">
                      Net Amount: <span className="text-blue-600">{(assignment.amount - assignment.discount).toFixed(2)}/-PKR</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ))}
      </div>
    </div>
  );
};

