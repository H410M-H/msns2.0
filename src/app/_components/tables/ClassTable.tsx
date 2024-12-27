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
import Link from "next/link";
import { ClassCreationDialog } from "../forms/class/ClassCreation";
import { ClassDeletionDialog } from "../forms/class/ClassDeletion";
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
const sectionColors: Record<string, string> = {
  ROSE: "bg-pink-100 text-pink-800",
  TULIP: "bg-yellow-100 text-yellow-800",
};

type ClassProps = {
  classId: string;
  grade: string;
  section: string;
  category: string;
  fee: number;
};

type ComponentProps = {
  sessionId: string;
};

export const ClassTable = ({ sessionId }: ComponentProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<ClassProps[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const classesData = api.class.getClasses.useQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await classesData.refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useMemo(() => {
    if (classesData.data) {
      setData(classesData.data as ClassProps[]);
    }
  }, [classesData.data]);

  const groupedData = useMemo(() => {
    const grouped: Record<string, ClassProps[]> = {};
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
    const classesInCategory = groupedData[category] ?? [];
    const newSelectedClasses = new Set(selectedClasses);

    if (selectedCategories.has(category)) {
      newSelectedCategories.delete(category);
      classesInCategory.forEach(cls => {
        newSelectedClasses.delete(cls.classId);
      });
    } else {
      newSelectedCategories.add(category);
      classesInCategory.forEach(cls => {
        newSelectedClasses.add(cls.classId);
      });
    }

    setSelectedCategories(newSelectedCategories);
    setSelectedClasses(newSelectedClasses);
  };

  const handleClassSelect = (classId: string, category: string) => {
    const newSelectedClasses = new Set(selectedClasses);
    const newSelectedCategories = new Set(selectedCategories);

    if (selectedClasses.has(classId)) {
      newSelectedClasses.delete(classId);
      // Check if we need to unselect the category
      const allClassesInCategory = groupedData[category] ?? [];
      const remainingSelectedClassesInCategory = allClassesInCategory.filter(cls => 
        cls.classId !== classId && newSelectedClasses.has(cls.classId)
      );
      if (remainingSelectedClassesInCategory.length === 0) {
        newSelectedCategories.delete(category);
      }
    } else {
      newSelectedClasses.add(classId);
      // Check if all classes in category are selected
      const allClassesInCategory = groupedData[category] ?? [];
      const allSelected = allClassesInCategory.every(cls => 
        newSelectedClasses.has(cls.classId) || cls.classId === classId
      );
      if (allSelected) {
        newSelectedCategories.add(category);
      }
    }

    setSelectedClasses(newSelectedClasses);
    setSelectedCategories(newSelectedCategories);
  };

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: "grade",
        header: "Grade",
        cell: ({ row }) => <div>{row.getValue("grade")}</div>,
      },
      {
        accessorKey: "section",
        header: "Section",
        cell: ({ row }) => <div>{row.getValue("section")}</div>,
      },
      {
        accessorKey: "fee",
        header: "Fee",
        cell: ({ row }) => <div>{row.getValue<number>("fee").toFixed(2)}</div>,
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
              placeholder="Search grade..."
              value={(table.getColumn("section")?.getFilterValue() as string) ?? ""}
              onChange={(event) => {
                const column = table.getColumn("section");
                if (column) {
                  column.setFilterValue(event.target.value);
                }
              }}
              className="pl-10 border-2 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all duration-300"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ClassCreationDialog />
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
            <ClassDeletionDialog
              classIds={Array.from(selectedClasses)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {categoryOrder.map((category) => (
          <ScrollArea key={category} className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
            <div
              className={`w-full cursor-pointer bg-gradient-to-r p-4 ${categoryColors[category] ?? "from-gray-100 to-gray-200 text-gray-800"}`}
            >
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3 justify-between">
                  <Checkbox
                    checked={selectedCategories.has(category)}
                    onClick={() => handleCategorySelect(category)}
                    className="h-5 w-5"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCategory(category)}
                >
                                  <h2 className="text-xl font-bold">{category}</h2>
                  <ChevronDown
                    className={`h-5 w-5 transform transition-transform duration-300 ${
                      expandedCategories[category] ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </div>
            </div>
            
            <div className={`grid grid-cols-1 p-6 transition-all duration-300 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 ${
              expandedCategories[category] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              {(groupedData[category] ?? []).map((row) => (
                <div
                  key={row.classId}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-indigo-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox
                        checked={selectedClasses.has(row.classId)}
                        onCheckedChange={() => handleClassSelect(row.classId, category)}
                        className="h-4 w-4"
                      />
                      <h3 className="text-lg font-bold text-gray-800">{row.grade}</h3>
                    </div>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      sectionColors[row.section] ?? 'bg-blue-100 text-blue-800'}
                    `}>
                      {row.section}
                    </span>
                    <p className="mt-3 text-xs font-medium text-gray-600">
                      Fee: <span className="text-red-600">{row.fee.toFixed(2)}/-PKR</span>
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                      asChild
                    >
                      <Link href={`/academics/classwiseDetail?classId=${row.classId}&sessionId=${sessionId}`}>
                        View Details
                      </Link>
                    </Button>
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

export default ClassTable;
