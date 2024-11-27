import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { SidebarProvider } from "~/components/ui/sidebar";
import Header from "./_components/shared/nav/Header";
import { Footer } from "./_components/shared/footer/footer";

export const metadata: Metadata = {
  title: "MSNS®",
  description: "Developed by MSND-DEV™",
  icons: [{ rel: "icon", url: "/logo-w.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="flex min-h-screen flex-col bg-gray-50">
        <TRPCReactProvider>
          <SidebarProvider>
            {/* Header */}
            <Header />
            {/* Main Content */}
            <main className="flex flex-1 w-full flex-col">
              {children}
            </main>
            {/* Footer */}
          </SidebarProvider>
        </TRPCReactProvider>
        <Footer />
      </body>
    </html>
  );
}
