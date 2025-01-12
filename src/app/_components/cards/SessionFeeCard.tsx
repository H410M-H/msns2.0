"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

interface ClassFeeProps {
  sfcId: string;
  studentClass: {
    session: {
      sessionName: string;
    };
    class: {
      grade: string;
    };
    student: {
      studentName: string;
    };
  };
  fee: {
    feeName: string;
    tuition: number;
  };
  discount: number;
  discountbypercent: number;
}

export default function SessionFeeCards() {
  const feeDetails: ClassFeeProps[] = []; // Replace this with your actual data

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Student Name</TableHead>
          <TableHead>Fee Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Discount %</TableHead>
          <TableHead>Net Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feeDetails.map((detail: ClassFeeProps) => (
          <TableRow key={detail.sfcId}>
            <TableCell>{detail.studentClass.session.sessionName}</TableCell>
            <TableCell>{detail.studentClass.class.grade}</TableCell>
            <TableCell>{detail.studentClass.student.studentName}</TableCell>
            <TableCell>{detail.fee.feeName}</TableCell>
            <TableCell>{detail.fee.tuition}</TableCell>
            <TableCell>{detail.discount}</TableCell>
            <TableCell>{detail.discountbypercent}%</TableCell>
            <TableCell>
              {detail.fee.tuition - detail.discount - (detail.fee.tuition * detail.discountbypercent / 100)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}