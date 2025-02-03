"use client";

import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import Link from "next/link";
import { ClassCreationDialog } from "../forms/class/ClassCreation";
import { ClassDeletionDialog } from "~/app/_components/forms/class/ClassDeletion";
import { Search, RefreshCw, PlusCircle, WalletCards } from 'lucide-react';
import { Checkbox } from "~/components/ui/checkbox";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { FeeAssignmentDialog } from "../forms/fee/feeAssignment";

const categoryOrder = ["Montessori", "Primary", "Middle", "SSC_I", "SSC_II"];
const categoryColors: Record<string, string> = {
  Montessori: "from-rose-100/60 to-rose-200/40",
  Primary: "from-indigo-100/60 to-indigo-200/40",
  Middle: "from-emerald-100/60 to-emerald-200/40",
  SSC_I: "from-amber-100/60 to-amber-200/40",
  SSC_II: "from-violet-100/60 to-violet-200/40",
};
const sectionColors: Record<string, string> = {
  ROSE: "bg-rose-100/90 text-rose-900",
  TULIP: "bg-amber-100/90 text-amber-900",
};

export const ClassList = ({ sessionId }: { sessionId: string }) => {
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const { data: classesData, isLoading, refetch } = api.class.getClasses.useQuery();

  const handleRefresh = async () => {
    await refetch();
  };

  const groupedData = useMemo(() => {
    const grouped: Record<string, typeof classesData> = {};
    classesData?.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category]?.push(item);
    });
    return grouped;
  }, [classesData]);

  const handleClassSelect = (classId: string) => {
    setSelectedClasses(prev => new Set(prev.has(classId) 
      ? [...prev].filter(id => id !== classId) 
      : [...prev, classId]));
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-slate-50/80 to-blue-50/80 p-6 shadow-sm backdrop-blur-sm border border-slate-100/80">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-grow max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search classes..."
              className="pl-11 h-12 text-base border-2 border-slate-200/50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100/50 rounded-xl bg-white/90 backdrop-blur-sm placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              size="sm"
              onClick={handleRefresh}
              className="gap-2 h-11 px-4 rounded-xl bg-white/95 text-slate-600 hover:bg-white shadow-sm border border-slate-200/60 hover:border-slate-300/50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <ClassDeletionDialog classIds={Array.from(selectedClasses)} />
              <Button size="sm" className="h-11 px-4 rounded-xl gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-md">
                <WalletCards className="w-4 h-4" />
                <FeeAssignmentDialog />
                </Button>
              <Button size="sm" className="h-11 px-4 rounded-xl gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md">
                <PlusCircle className="w-4 h-4" />
                <ClassCreationDialog/>
                </Button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue={categoryOrder[0]}>
        <TabsList className="mb-6 flex w-full overflow-x-auto pb-2 gap-1.5">
          {categoryOrder.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className={cn(
                "px-4 py-2.5 text-sm font-semibold rounded-lg transition-all",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:text-white",
                "border data-[state=active]:border-transparent border-slate-200/60",
                categoryColors[category]
              )}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content Sections */}
        {categoryOrder.map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-44 rounded-xl bg-slate-100/50" />
                ))
              ) : (
                groupedData[category]?.map((classItem) => (
                  <div
                    key={classItem.classId}
                    className="group relative rounded-xl bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100/80 hover:border-blue-100/50"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4 gap-3">
                        <Checkbox
                          checked={selectedClasses.has(classItem.classId)}
                          onCheckedChange={() => handleClassSelect(classItem.classId)}
                          className="h-5 w-5 border-2 border-slate-300/80 data-[state=checked]:border-blue-500 mt-1.5"
                        />
                        <div className="space-y-1.5">
                          <h3 className="text-2xl font-bold text-slate-800">{classItem.grade}</h3>
                          <span className={cn(
                            "inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide",
                            sectionColors[classItem.section]
                          )}>
                            {classItem.section}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-5 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Monthly Fee:</span>
                          <span className="font-medium text-emerald-700">
                            {classItem.fee.toFixed(2)} PKR
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-2.5">
                        <Button
                          asChild
                          size="sm"
                          className="w-full rounded-lg bg-blue-100/50 text-blue-700 hover:bg-blue-200/50 transition-all hover:text-blue-800"
                        >
                          <Link 
                            href={`/academics/sessionalDetails/class/?classId=${classItem.classId}&sessionId=${sessionId}`}
                          >
                            View Class
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="w-full rounded-lg bg-emerald-100/50 text-emerald-700 hover:bg-emerald-200/50 hover:text-emerald-800"
                        >
                          <Link
                            href={`/academics/sessionalDetails/fee/?classId=${classItem.classId}&sessionId=${sessionId}`}
                          >
                            Fee Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};