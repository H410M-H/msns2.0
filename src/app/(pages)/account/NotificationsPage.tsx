'use client'

import { Bell, Mail, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Switch } from "~/components/ui/switch"

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            <span className="bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
              Notifications
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Customize how you want to be notified about important updates.
          </p>
        </div>
        <Separator className="my-8 bg-green-600 h-1" />

        {/* Notifications Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                Push Notifications
              </CardTitle>
              <CardDescription>
                Get notified about important updates directly in your browser
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New messages</span>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mentions</span>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Updates</span>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Control the emails you receive about your activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily digest</span>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Weekly summary</span>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Important alerts</span>
                <Switch className="data-[state=checked]:bg-green-600" disabled />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                In-App Notifications
              </CardTitle>
              <CardDescription>
                Manage your in-app notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Direct messages</span>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Comments</span>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System notifications</span>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        <Separator className="mt-8 bg-green-600 h-1" />
      </div>
    </main>
  )
}