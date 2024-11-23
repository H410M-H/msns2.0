import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
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
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Header />
        <main>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}