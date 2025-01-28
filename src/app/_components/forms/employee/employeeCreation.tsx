"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, Upload, ImagePlus } from "lucide-react"
import { api } from "~/trpc/react"
import { toast } from "~/hooks/use-toast"
import { CldImage, CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary"
import { Separator } from "~/components/ui/separator"

const employeeSchema = z.object({
  employeeName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
  fatherName: z
    .string()
    .min(2, "Father's name must be at least 2 characters")
    .max(100, "Father's name must not exceed 100 characters"),
  gender: z.enum(["MALE", "FEMALE", "CUSTOM"]),
  dob: z.string().min(1, "Date of Birth is required"),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format"),
  maritalStatus: z.enum(["Married", "Unmarried", "Widow", "Divorced"]),
  doj: z.string({ message: "Date of Joining is required" }),
  designation: z.enum(["Principal", "Admin", "Head", "Clerk", "Teacher", "Worker"]),
  residentialAddress: z.string().min(5, "Residential Address must be at least 5 characters"),
  mobileNo: z.string().regex(/^(\+92|0)?3\d{9}$/, "Invalid Pakistani mobile number format"),
  additionalContact: z
    .string()
    .regex(/^(\+92|0)?3\d{9}$/, "Invalid Pakistani mobile number format")
    .optional(),
  education: z
    .string()
    .min(2, "Education must be at least 2 characters")
    .max(100, "Education must not exceed 100 characters"),
  profilePic: z.string().optional(),
  cv: z.string().optional(),
})

type EmployeeSchema = z.infer<typeof employeeSchema>

export default function EmployeeCreationDialog() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("")
  const [uploadedCvUrl, setUploadedCvUrl] = useState<string>("")

  const form = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      gender: "MALE",
      maritalStatus: "Unmarried",
      designation: "Teacher",
    },
  })

  const createEmployee = api.employee.createEmployee.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Employee registered successfully",
      })
      form.reset()
      setUploadedImageUrl("")
      setUploadedCvUrl("")
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    },
  })

  const onSubmit = async (data: EmployeeSchema) => {
    try {
      await createEmployee.mutateAsync({
        ...data,
        profilePic: uploadedImageUrl,
        cv: uploadedCvUrl,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const renderFormField = (name: keyof EmployeeSchema, label: string, type = "text", placeholder = "") => (
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
            <h2 className="text-4xl items font-extrabold relative z-10 text-white">Employee Registration Form</h2>
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
                                const info = result.info
                                if (typeof info !== "string") {
                                  const secure_url = info?.secure_url ?? ""
                                  field.onChange(secure_url)
                                  setUploadedImageUrl(secure_url)
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
                  {renderFormField("employeeName", "Employee Name", "text", "Enter full name")}
                  {renderFormField("fatherName", "Father's Name", "text", "Enter full name")}
                  {renderFormField("cnic", "CNIC", "text", "xxxxx-xxxxxxx-x")}
                  {renderFormField("dob", "Date of Birth", "date")}
                  {renderFormField("doj", "Date of Joining", "date")}
                  {renderFormField("mobileNo", "Mobile Number", "tel", "Enter 11-digit number")}
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
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select marital status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Unmarried">Unmarried</SelectItem>
                            <SelectItem value="Widow">Widow</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select designation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Principal">Principal</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Head">Head</SelectItem>
                            <SelectItem value="Clerk">Clerk</SelectItem>
                            <SelectItem value="Teacher">Teacher</SelectItem>
                            <SelectItem value="Worker">Worker</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderFormField("residentialAddress", "Residential Address", "text", "Enter current residence")}
                  {renderFormField("additionalContact", "Additional Contact", "tel", "Enter additional contact number")}
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderFormField("education", "Education", "text", "Enter highest education")}
                  <FormField
                    control={form.control}
                    name="cv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Curriculum Vitae (CV)</FormLabel>
                        <FormControl>
                          <CldUploadWidget
                            options={{ sources: ["local"], maxFiles: 1 }}
                            uploadPreset="msnsCV"
                            onSuccess={(result: CloudinaryUploadWidgetResults) => {
                              const info = result.info
                              if (typeof info !== "string") {
                                const secure_url = info?.secure_url ?? ""
                                field.onChange(secure_url)
                                setUploadedCvUrl(secure_url)
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
                                <span>Upload CV</span>
                              </Button>
                            )}
                          </CldUploadWidget>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="p-6 bg-gray-50 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => form.reset()} className="rounded-lg">
              Reset Form
            </Button>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={createEmployee.isPending}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              {createEmployee.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </div>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

