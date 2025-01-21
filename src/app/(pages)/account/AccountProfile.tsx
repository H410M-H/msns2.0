"use client"

import React, { useState } from 'react';
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
import { Switch } from "~/components/ui/switch"
import { Separator } from "~/components/ui/separator"
import { Tabs, TabsContent } from "~/components/ui/tabs"
import { useUser } from "~/lib/context/user-context"
import { useToast } from "~/hooks/use-toast"
import { Textarea } from '~/components/ui/textarea';

// Combined schema for all user data
const userSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  email: z
    .string()
    .min(1, { message: "This field is required." })
    .email("This is not a valid email."),
  bio: z.string().max(160).optional(),
  notifications: z.boolean(),
  marketing: z.boolean(),
  security_emails: z.boolean(),
})

type UserFormValues = z.infer<typeof userSchema>

export default function AccountProfile() {
  const { user, updateUser, createUser } = useUser()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? "",
      notifications: user?.notifications ?? false,
      marketing: user?.marketing ?? false,
      security_emails: user?.security_emails ?? true,
    },
  })

  function onSubmit(data: UserFormValues) {
    if (!user) {
      createUser({ ...data, avatar: "" })
    } else {
      updateUser(data)
    }
    
    toast({
      title: user ? "Profile updated" : "Profile created",
      description: `Your profile has been ${user ? 'updated' : 'created'} successfully.`,
    })
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="mb-4 text-2xl font-bold">Create Your Profile</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Create Profile</Button>
            </form>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <main className="h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            <span className="bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
              Account Management
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage your profile information and account preferences
          </p>
        </div>

        <Separator className="my-8 bg-green-600 h-1" />

        <div className="mx-auto max-w-3xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mt-8 bg-white p-8 shadow-lg rounded-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <TabsContent value="profile">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Your email will not be displayed publicly.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about yourself"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description for your profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="settings">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="notifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Push Notifications
                              </FormLabel>
                              <FormDescription>
                                Receive notifications about activity.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="marketing"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Marketing Emails
                              </FormLabel>
                              <FormDescription>
                                Receive emails about new features.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="security_emails"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Security Alerts
                              </FormLabel>
                              <FormDescription>
                                Critical security notifications.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  )
}