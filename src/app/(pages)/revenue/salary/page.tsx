"use client"

import { PageHeader } from "~/app/_components/shared/nav/PageHeader"
import { SalaryTable } from "~/app/_components/tables/SalaryTable"
import { Separator } from "~/components/ui/separator"
import { Input } from "~/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "~/components/ui/select"
import { useState } from 'react'
import { SalaryAssignmentForm } from "~/app/_components/forms/employee/SalaryAllotment"

export default function SalaryPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/employees", label: "Employees" },
    { href: "/revenue/salary", label: "Salary Management", current: true },
  ]

  return (
    <main className="min-h-screen bg-gray-50 sm:px-6 sm:py-0">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="container mx-auto pt-[5rem] px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-green-900 tracking-tight">
              Employee Compensation Management
            </h1>
            <p className="text-md text-green-600">
              Manage salary allocations and adjustments efficiently
            </p>
          </div>

          <Separator className="bg-green-100" />

          <div className="bg-white rounded-lg shadow-sm border border-green-50 p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm focus-visible:ring-green-200"
              />
              <div className="flex gap-4">
                <SalaryAssignmentForm />
                <Select 
                  value={pageSize.toString()} 
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger className="w-[180px] focus-visible:ring-green-200">
                    <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 rows</SelectItem>
                    <SelectItem value="20">20 rows</SelectItem>
                    <SelectItem value="50">50 rows</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SalaryTable 
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              searchTerm={searchTerm}
            />
          </div>

          <div className="pb-6 text-center text-sm text-green-700">
            <p>
              Real-time salary data management | Secured transactions | Audit-ready records
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}