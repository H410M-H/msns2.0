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
} from "~/components/ui/form"
import { Switch } from "~/components/ui/switch"
import { useToast } from "~/hooks/use-toast"
import { useUser } from "~/lib/context/user-context"
import { Separator } from "~/components/ui/separator"
import { ScrollArea } from "~/components/ui/scroll-area"

const settingsFormSchema = z.object({
  notifications: z.boolean(),
  marketing: z.boolean(),
  security_emails: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export default function AccountSettings() {
  const { user, updateUser } = useUser()
  const { toast } = useToast()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      notifications: user?.notifications ?? false,
      marketing: user?.marketing ?? false,
      security_emails: user?.security_emails ?? true,
    },
  })

  function onSubmit(data: SettingsFormValues) {
    updateUser(data)
    toast({
      title: "Settings updated",
      description: "Your settings have been updated successfully.",
    })
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <ScrollArea className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            <span className="bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
              Account Settings
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage your account preferences and security settings.
          </p>
        </div>
        <Separator className="my-8 bg-green-600 h-1" />

        {/* Settings Form Section */}
        <div className="relative max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12">
          <div className="space-y-6">
            <div className="text-left">
              <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                Privacy & Notifications
              </h2>
              <p className="text-sm text-gray-600">
                Control how you receive updates and manage your data.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="mb-4 sm:mb-0">
                        <FormLabel className="text-base font-medium text-gray-700">
                          Push Notifications
                        </FormLabel>
                        <FormDescription className="text-sm text-gray-500">
                          Receive notifications about your account activity.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketing"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="mb-4 sm:mb-0">
                        <FormLabel className="text-base font-medium text-gray-700">
                          Marketing Communications
                        </FormLabel>
                        <FormDescription className="text-sm text-gray-500">
                          Receive emails about new features and updates.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="security_emails"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="mb-4 sm:mb-0">
                        <FormLabel className="text-base font-medium text-gray-700">
                          Security Alerts
                        </FormLabel>
                        <FormDescription className="text-sm text-gray-500">
                          Receive critical security notifications (cannot be disabled).
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled
                          className="data-[state=checked]:bg-green-600"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

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
      </ScrollArea>
    </main>
  )
}