import * as React from "react"
import { ScrollArea } from "~/components/ui/scroll-area"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="flex h-screen pt-20">
        <ScrollArea>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </ScrollArea>
      </div>
  )
}