import ProfilePage from "./AccountProfile"
import AccountSettings from "./AccountSettings"
import { Tabs } from "./AccountTabs"
import NotificationsPage from "./NotificationsPage"
import { PageHeader } from "~/app/_components/shared/nav/PageHeader"

export default function AccountPage() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/account", label: "Account", current: true },
  ]

  const tabs = [
    { label: "Profile", content: <ProfilePage /> },
    { label: "Settings", content: <AccountSettings /> },
    { label: "Notifications", content: <NotificationsPage /> },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <PageHeader breadcrumbs={breadcrumbs} />
        <Tabs tabs={tabs} />
    </div>
  )
}