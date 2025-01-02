import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/QueryProvider";
import { SheetProvider } from "@/providers/SheetProvider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NavigationSidebar } from "@/components/layout/navigation-sidebar";
import { Header } from "@/components/layout/Header";
import { WelcomeMsg } from "@/components/layout/WelcomeMsg";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoreLedger",
  description: "The only accounting application you need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={'/'}>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
