"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "~/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { api } from "~/trpc/react"
import { toast } from "~/hooks/use-toast"
import { Separator } from "~/components/ui/separator"
import { CldImage } from "next-cloudinary"
import { Gender, MaritalStatus, Designation } from "@prisma/client"
import { FileUploader } from "../../(blocks)/file-uploader"

const employeeSchema = z.object({
  employeeName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
  fatherName: z
    .string()
    .min(2, "Father's name must be at least 2 characters")
    .max(100, "Father's name must not exceed 100 characters"),
  gender: z.nativeEnum(Gender),
  dob: z.string().min(1, "Date of Birth is required").default("none"),
  cnic: z
    .string()
    .length(15, "CNIC must be exactly 15 characters")
    .regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format"),
  maritalStatus: z.nativeEnum(MaritalStatus),
  doj: z.string({message: "Date of Joining is required"}).default("none"),
  designation: z.nativeEnum(Designation),
  residentialAddress: z.string().min(5, "Residential Address must be at least 5 characters"),
  mobileNo: z
    .string()
    .max(13, "Mobile number must not exceed 13 characters")
    .regex(/^(\+92|0)?3\d{9}$/, "Invalid Pakistani mobile number format"),
  additionalContact: z
    .string()
    .max(13, "Mobile number must not exceed 13 characters")
    .regex(/^(\+92|0)?3\d{9}$/, "Invalid Pakistani mobile number format")
    .optional()
    .nullable(),
  education: z
    .string()
    .min(2, "Education must be at least 2 characters")
    .max(100, "Education must not exceed 100 characters"),
  profilePic: z.string().optional().nullable(),
  cv: z.string().optional().nullable(),
})

type EmployeeSchema = z.infer<typeof employeeSchema>

export default function EmployeeCreationDialog() {
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [cv, setCv] = useState<File | null>(null)

  const form = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      gender: "MALE" as Gender | "CUSTOM",
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
      setProfilePic(null)
      setCv(null)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    },
  })

  const handleProfilePicChange = (file: File) => {
    setProfilePic(file)
  }

  const handleCvChange = (file: File) => {
    setCv(file)
  }

  const onSubmit = async (data: EmployeeSchema) => {
    try {
      const { employeeName, fatherName, gender, dob, cnic, maritalStatus, doj, ...rest } = data
      const formData = new FormData()

      formData.append("employeeName", employeeName)
      formData.append("fatherName", fatherName)
      formData.append("gender", gender)
      formData.append("dob", dob)
      formData.append("cnic", cnic)
      formData.append("maritalStatus", maritalStatus)
      formData.append("doj", doj)

      Object.entries(rest).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      if (profilePic) {
        formData.append("profilePic", profilePic)
      }
      if (cv) {
        formData.append("cv", cv)
      }

      await createEmployee.mutateAsync({
        employeeName,
        fatherName,
        gender: "MALE",
        dob: "",
        cnic: "",
        maritalStatus: "Married",
        doj: "",
        designation: "Principal",
        residentialAddress: "",
        mobileNo: "",
        education: ""
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
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-8xl"
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
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
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {renderFormField("education", "Education", "text", "Enter highest education")}
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderFormField("residentialAddress", "Residential Address", "text", "Enter current residence")}
                  {renderFormField("additionalContact", "Additional Contact", "tel", "Enter additional contact number")}
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="profilePic"
                    render={() => (
                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <FileUploader
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            className="cursor-pointer file:bg-primary file:text-primary-foreground file:border-0 file:mr-4 file:rounded-full hover:file:bg-primary/90 transition-colors"
                          />
                        </FormControl>
                        <FormDescription>Upload a profile picture (JPG, PNG)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cv"
                    render={() => (
                      <FormItem>
                        <FormLabel>Curriculum Vitae (CV)</FormLabel>
                        <FormControl>
                          <FileUploader
                            accept=".pdf,.doc,.docx"
                            onChange={handleCvChange}
                            className="cursor-pointer file:bg-primary file:text-primary-foreground file:border-0 file:mr-4 file:rounded-full hover:file:bg-primary/90 transition-colors"
                          />
                        </FormControl>
                        <FormDescription>Upload your CV (PDF, DOC, DOCX)</FormDescription>
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

