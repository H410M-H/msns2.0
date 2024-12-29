import { RegistrationCards } from "~/app/_components/cards/RegistrationCard";
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { Separator } from "~/components/ui/separator";


export default function RegistrationPage() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/academics", label: "Academics" },
    { href: "/academics/userReg", label: "User Management", current: true },
  ];
    return (
      <main className="min-h-screen bg-yellow-100/50 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="container mx-auto pt-20">
        <Separator className="bg-green-900" />
        <div className="relative overflow-hidden">
        <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-gradient-to-r from-green-600 to-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></div>
          <h1 className="p-2 text-center font-serif text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent transition-all duration-300 hover:from-orange-400 hover:to-green-500">
            Online Registration Portal
            </span>
          </h1>
        </div>
      <Separator className="bg-green-900" />
  <RegistrationCards />
  <Separator className="bg-green-900" />
      </div>
    </main>
  )
}