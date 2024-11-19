
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="flex min-h-screen pt-20">
      <main className="flex-1">{children}</main>
    </div>
  )
}