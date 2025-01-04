'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "~/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useUser } from "~/lib/context/user-context"
import { useToast } from "~/hooks/use-toast"
import { Separator } from "~/components/ui/separator"

const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters." })
        .max(30, { message: "Name must not be longer than 30 characters." }),
    email: z
        .string()
        .min(1, { message: "This field is required." })
        .email("This is not a valid email."),
    bio: z.string().max(160).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
    const { user, updateUser } = useUser()
    const { toast } = useToast()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            bio: user?.bio ?? "",
        },
    })

    function onSubmit(data: ProfileFormValues) {
        updateUser(data)
        toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
        })
    }

    if (!user) {
        return null
    }

    return (
        <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              <span className="bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
                Manage Profile
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Customize your profile information and settings with ease.
            </p>
          </div>
          <Separator className="my-8 bg-green-600 h-1" />
  
          {/* Profile Form Section */}
          <div className="relative max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12">
            <div className="space-y-6">
              <div className="text-left">
                <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                  Profile Information
                </h2>
                <p className="text-sm text-gray-600">
                  Update your profile details to keep your information accurate.
                </p>
              </div>
  
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-700">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            {...field}
                            className="border-gray-300 rounded-md"
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-500">
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-700">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                            className="border-gray-300 rounded-md"
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-500">
                          Your email address will not be shared publicly.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  {/* Bio Field */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-700">Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about yourself"
                            className="resize-none border-gray-300 rounded-md"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-500">
                          Brief description for your profile.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  {/* Submit Button */}
                  <div className="text-right">
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-md px-6 py-2"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <Separator className="mt-8 bg-green-600 h-1" />
        </div>
      </main>
    )
}
