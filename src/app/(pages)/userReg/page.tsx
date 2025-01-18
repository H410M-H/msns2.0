"use client"
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight } from "lucide-react";
import { RegistrationCards } from "~/app/_components/cards/RegistrationCard";
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";


export default function RegistrationPage() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/academics", label: "Academics" },
    { href: "/academics/userReg", label: "User Management", current: true },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-yellow-50"
    >
      <div className="relative">
        <PageHeader breadcrumbs={breadcrumbs} />
        <div className="container mx-auto pt-16 pb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
              </div>
              <h1 className="relative text-center font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
                  Online Registration Portal
                  <GraduationCap className="inline-block w-12 h-12 mb-2 text-green-600" />
                </span>
              </h1>
              <div className="flex mt-2 justify-center items-center gap-2 text-sm text-gray-600">
                <span>Begin Your Academic Journey</span>
                <ArrowRight className="w-4 h-4" />
                <span>Register Now</span>
              </div>
              <RegistrationCards />
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12"
          >
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>© 2025 Registration Portal. All rights reserved.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}