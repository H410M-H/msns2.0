import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { UserProvider } from "~/lib/context/user-context";
import { Toaster } from "~/components/ui/toaster";
import Header from "./_components/shared/nav/Header";
import { Footer } from "./_components/shared/footer/footer";

export const metadata: Metadata = {
  title: "MSNS® | LMS",
  description: "Developed by MSND-DEV™",
  icons: [{ rel: "icon", url: "/logo-w.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="flex min-h-screen flex-col">
        <TRPCReactProvider>
          <UserProvider>
            <SidebarProvider>
            <Header />
              <main className="flex-1">{children}
              </main>
            </SidebarProvider>
            <Footer />
            <Toaster />
          </UserProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

