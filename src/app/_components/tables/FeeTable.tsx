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
import { FeeCreationDialog } from "../forms/fee/FeeCreation";
import { FeeDeletionDialog } from "../forms/fee/FeeDeletion";
import { Search, RefreshCw, ChevronDown } from 'lucide-react';
import { Checkbox } from "~/components/ui/checkbox";
import { ScrollArea } from "~/components/ui/scroll-area";
import Link from "next/link";

const categoryOrder = ["MonthlyFee", "AnnualFee"];
const categoryColors: Record<string, string> = {
  MonthlyFee: "from-emerald-100 to-emerald-200 text-emerald-800",
  AnnualFee: "from-blue-100 to-blue-200 text-blue-800",
};

type FeeProps = {
  fee: number;
  feeId: string;
  feeName: string;
  tuition: number;
  type: "MonthlyFee" | "AnnualFee";
};

type ComponentProps = {
  sessionId: string;
};

export const FeeTable = ({ sessionId }: ComponentProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<FeeProps[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedFees, setSelectedFees] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const feesData = api.fee.getFees.useQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await feesData.refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useMemo(() => {
    if (feesData.data) {
      setData(feesData.data as unknown as FeeProps[]);
    }
  }, [feesData.data]);

  const groupedData = useMemo(() => {
    const grouped: Record<string, FeeProps[]> = {};
    data.forEach((item) => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type]?.push(item);
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
    const feesInCategory = groupedData[category] ?? [];
    const newSelectedFees = new Set(selectedFees);

    if (selectedCategories.has(category)) {
      newSelectedCategories.delete(category);
      feesInCategory.forEach(fee => {
        newSelectedFees.delete(fee.feeId);
      });
    } else {
      newSelectedCategories.add(category);
      feesInCategory.forEach(fee => {
        newSelectedFees.add(fee.feeId);
      });
    }

    setSelectedCategories(newSelectedCategories);
    setSelectedFees(newSelectedFees);
  };

  const handleFeeSelect = (feeId: string, category: string) => {
    const newSelectedFees = new Set(selectedFees);
    const newSelectedCategories = new Set(selectedCategories);

    if (selectedFees.has(feeId)) {
      newSelectedFees.delete(feeId);
      const allFeesInCategory = groupedData[category] ?? [];
      const remainingSelectedFeesInCategory = allFeesInCategory.filter(fee =>
        fee.feeId !== feeId && newSelectedFees.has(fee.feeId)
      );
      if (remainingSelectedFeesInCategory.length === 0) {
        newSelectedCategories.delete(category);
      }
    } else {
      newSelectedFees.add(feeId);
      const allFeesInCategory = groupedData[category] ?? [];
      const allSelected = allFeesInCategory.every(fee =>
        newSelectedFees.has(fee.feeId) || fee.feeId === feeId
      );
      if (allSelected) {
        newSelectedCategories.add(category);
      }
    }

    setSelectedFees(newSelectedFees);
    setSelectedCategories(newSelectedCategories);
  };

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: "feeName",
        header: "Fee Name",
        cell: ({ row }) => <div>{row.getValue("feeName")}</div>,
      },
      {
        accessorKey: "tuition",
        header: "Tuition",
        cell: ({ row }) => <div>{row.getValue<number>("tuition").toFixed(2)}</div>,
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
<div className="w-full p-4 sm:px-6 lg:px-8 mt-10">
  {/* Header Section */}
  <div className="gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-lg">
    <div className="flex  items-center justify-between gap-4">
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search fees..."
          value={(table.getColumn("feeName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            const column = table.getColumn("feeName");
            if (column) {
              column.setFilterValue(event.target.value);
            }
          }}
          className="pl-10 border-2 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all duration-300"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <FeeCreationDialog />
        <Button
          variant="outline"
          className={`bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all duration-300 ${isRefreshing ? "animate-pulse" : ""}`}
          onClick={handleRefresh}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <FeeDeletionDialog feeIds={Array.from(selectedFees)} />
      </div>
    </div>
  </div>

  {/* Content Section */}
  <div className="space-y-4">
    {categoryOrder.map((category) => (
      <ScrollArea key={category} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
        <div
          className={`w-full cursor-pointer bg-gradient-to-r p-4 ${categoryColors[category] ?? "from-gray-100 to-gray-200 text-gray-800"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedCategories.has(category)}
                onClick={() => handleCategorySelect(category)}
                className="h-5 w-5"
              />
              <h2 className="text-xl font-bold">{category}</h2>
            </div>
            <ChevronDown
              className={`h-5 w-5 transform transition-transform duration-300 ${expandedCategories[category] ? "rotate-180" : ""}`}
              onClick={() => toggleCategory(category)}
            />
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-4 p-6 transition-all duration-300 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 ${expandedCategories[category] ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
          {(groupedData[category] ?? []).map((row) => (
            <div
              key={row.feeId}
              className="relative group overflow-hidden rounded-lg bg-gradient-to-br from-white to-gray-50 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-indigo-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox
                    checked={selectedFees.has(row.feeId)}
                    onCheckedChange={() => handleFeeSelect(row.feeId, category)}
                    className="h-4 w-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">{row.feeName}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Tuition: <span className="text-red-600">{row.fee.toFixed(2)}/-PKR</span>
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-3 py-1 rounded-md transition-all duration-300"
                  asChild
                >
                                        <Link href={`/revenue/fee/?feeId=${row.feeId}&sessionId=${sessionId}`}>
                        View Details
                      </Link>
                  {/* <FeeAllotmentDialog classId={sessionId} /> */}
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