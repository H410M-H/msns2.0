'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, Upload, ImagePlus } from 'lucide-react'
import { api } from "~/trpc/react"
import { toast } from '~/hooks/use-toast'
import { CldImage, CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary"
import { Separator } from '~/components/ui/separator'

const studentSchema = z.object({
  studentMobile: z.string().regex(/^(\+92|0)?3\d{9}$/, "Invalid Pakistani mobile number format"),
  fatherMobile: z.string().regex(/^(\+92|0)?3\d{9}$/, "Invalid Pakistani mobile number format"),
  studentName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
  gender: z.enum(['MALE', 'FEMALE', 'CUSTOM']),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters").max(100, "Father's name must not exceed 100 characters"),
  studentCNIC: z.string().regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format"),
  fatherCNIC: z.string().regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format"),
  fatherProfession: z.string().min(1, "Father's profession is required"),
  bloodGroup: z.string().optional(),
  guardianName: z.string().optional(),
  caste: z.string().min(1, "Caste is required"),
  registrationDate: z.string().min(1, "Registration Date is required"),
  currentAddress: z.string().min(5, "Current Address must be at least 5 characters"),
  permanentAddress: z.string().min(5, "Permanent Address must be at least 5 characters"),
  medicalProblem: z.string().optional(),
  discount: z.number().min(0).max(100),
  discountbypercent: z.number().min(0).max(100),
  profilePic: z.string().optional(),
})

type StudentSchema = z.infer<typeof studentSchema>

export default function StudentRegistrationForm() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')

  const form = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: 'CUSTOM',
      bloodGroup: '',
      guardianName: '',
      medicalProblem: '',
      discount: 0,
      discountbypercent: 0,
    },
  })

  const createStudent = api.student.createStudent.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Student registered successfully",
      })
      form.reset()
      setUploadedImageUrl('')
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    },
  })

  const onSubmit = async (data: StudentSchema) => {
    try {
      const { studentName, fatherName, ...rest } = data
      const formData = new FormData()

      formData.append("studentName", studentName)
      formData.append("fatherName", fatherName)
      formData.append("dateOfBirth", data.dateOfBirth)
      formData.append("cnic", data.studentCNIC)
      formData.append("doj", data.registrationDate)
      formData.append("residentialAddress", data.currentAddress)
      formData.append("mobileNo", data.studentMobile)
      
      
      Object.entries(rest).forEach(([key, value]) => {
        if (value) formData.append(key, String(value))
      })

      if (uploadedImageUrl) {
        formData.append("profilePic", uploadedImageUrl)
      }

      await createStudent.mutateAsync({
        studentName,
        fatherName,
        ...rest,
        gender: "MALE",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const renderFormField = (name: keyof StudentSchema, label: string, type = "text", placeholder = "") => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder || label}
              className="rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              {...field}
              value={field.value ?? ""}
              onChange={type === "number" ? (e) => field.onChange(parseFloat(e.target.value)) : field.onChange}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-8xl mx-auto"
      >
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl overflow-hidden border-0">
        <CardHeader className="relative min-h-[100px] items-center">
            <CldImage
              src="https://res.cloudinary.com/dvvbxrs55/image/upload/v1737374740/hex-one_cihfwh.jpg"
              alt="School building"
              fill
              style={{ objectFit: "cover" }}
              className="relative inset-0 w-full h-full object-fill filter brightness-75"
            />
            <div className="absolute inset-0" />
            <h2 className="text-4xl items font-extrabold relative z-10 text-white">Student Registration Form</h2>
          </CardHeader>

          <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex justify-center">
                <FormField
                  control={form.control}
                  name="profilePic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Profile Picture</FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center space-y-4">
                          {uploadedImageUrl ? (
                            <CldImage
                              src={uploadedImageUrl}
                              alt="Profile"
                              width={100}
                              height={100}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
                              <ImagePlus className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <CldUploadWidget
                            options={{ sources: ["local"], maxFiles: 1 }}
                            uploadPreset="msnsPDP"
                            onSuccess={(result: CloudinaryUploadWidgetResults) => {
                              const info = result.info;
                              if (typeof info !== "string") {
                                const secure_url = info?.secure_url ?? '';
                                field.onChange(secure_url);
                                setUploadedImageUrl(secure_url);
                              }
                            }}
                          >
                            {({ open }) => (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => open()}
                                className="flex items-center space-x-2"
                              >
                                <Upload className="w-4 h-4" />
                                <span>Upload Photo</span>
                              </Button>
                            )}
                          </CldUploadWidget>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderFormField("studentName", "Student Name", "text", "Enter full name")}
                {renderFormField("studentCNIC", "B-Form #", "text", "xxxxx-xxxxxxx-x")}
                {renderFormField("fatherName", "Father's Name", "text", "Enter full name")}
                {renderFormField("fatherCNIC", "Father CNIC", "text", "xxxxx-xxxxxxx-x")}
                {renderFormField("dateOfBirth", "Date of Birth", "date")}
                {renderFormField("studentMobile", "Mobile Number", "tel", "Enter 11-digit number")}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="CUSTOM">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {renderFormField("bloodGroup", "Blood Group", "text", "Optional")}
                {renderFormField("caste", "Caste", "text", "Enter caste")}
                {renderFormField("medicalProblem", "Medical Conditions", "text", "Optional")}
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderFormField("fatherMobile", "Father's Mobile", "tel", "Enter 11-digit number")}
                {renderFormField("fatherProfession", "Father's Profession", "text", "Enter profession")}
                {renderFormField("guardianName", "Guardian Name", "text", "Optional")}
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFormField("currentAddress", "Current Address", "text", "Enter current residence")}
                {renderFormField("permanentAddress", "Permanent Address", "text", "Enter permanent address")}
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderFormField("registrationDate", "Registration Date", "date")}
                {renderFormField("discount", "Discount Amount", "number", "Enter discount amount")}
                {renderFormField("discountbypercent", "Discount Percentage", "number", "Enter discount percentage")}
              </div>
            </form>
          </Form>
          </CardContent>
          <CardFooter className="p-6 bg-gray-50 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="rounded-lg"
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={createStudent.isPending}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              {createStudent.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </div>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

