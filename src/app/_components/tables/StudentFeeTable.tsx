"use client"

import { useState } from "react"
import { api } from "~/trpc/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { LoadingSpinner } from "../(blocks)/loading-spinner"

export function FeeAssignmentTable() {
  const [selectedSession, setSelectedSession] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")

  const { data: sessions, isLoading: isLoadingSessions } = api.session.getSessions.useQuery()
  const { data: classes, isLoading: isLoadingClasses } = api.class.getClasses.useQuery()
  const { data: feeAssignments, isLoading: isLoadingFeeAssignments } = api.fee.getFeeAssignmentsByClassAndSession.useQuery(
    { classId: selectedClass, sessionId: selectedSession },
    { enabled: !!(selectedClass && selectedSession) },
  )

  if (isLoadingSessions || isLoadingClasses) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex space-x-4">
        <Select value={selectedSession} onValueChange={setSelectedSession}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Session" />
          </SelectTrigger>
          <SelectContent>
            {sessions?.map((session) => (
              <SelectItem key={session.sessionId} value={session.sessionId}>
                {session.sessionName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {classes?.map((class_) => (
              <SelectItem key={class_.classId} value={class_.classId}>
                {class_.grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoadingFeeAssignments ? (
        <LoadingSpinner />
      ) : feeAssignments && feeAssignments.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Fee Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Discount %</TableHead>
              <TableHead>Final Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeAssignments.map((assignment) => (
              <TableRow key={assignment.sfcId}>
                <TableCell>{assignment.studentClass.student.studentName}</TableCell>
                <TableCell>{assignment.fee.level}</TableCell>
                <TableCell>Rs. {assignment.fee.tuitionFee.toFixed(2)}</TableCell>
                <TableCell>Rs. {assignment.discount.toFixed(2)}</TableCell>
                <TableCell>{assignment.discountByPercent.toFixed(2)}%</TableCell>
                <TableCell>Rs. {(assignment.fee.tuitionFee - assignment.discount).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No fee assignments found for the selected class and session.</p>
      )}
    </div>
  )
}

