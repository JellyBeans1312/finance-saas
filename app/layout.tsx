import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { OnboardingModal } from "@/components/onboarding-modal";
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
          <OnboardingModal />
        </body>
      </html>
    </ClerkProvider>
  );
}
