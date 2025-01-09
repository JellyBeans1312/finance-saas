"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AppFeatures } from "@/db/schema";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Filters } from "@/components/layout/Filters";
import { Header } from "@/components/layout/Header";
import { WelcomeMsg } from "@/components/layout/WelcomeMsg";

import { BankingLoadingSkeleton } from "@/components/banking/banking-loading";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { useMediaQuery } from "@/hooks/use-media-query";


const MOBILE_TABS = [
    { label: "Accounts", path: "/banking/accounts" },
    { label: "Categories", path: "/banking/categories" },
    { label: "Transactions", path: "/banking/transactions" },
]

type Props = { 
    children: React.ReactNode
}

const BankingLayout = ({children} : Props) => {
    const { shouldBlockFeature, triggerPaywall, isLoading } = usePaywall();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();
    const pathname = usePathname();

    if (shouldBlockFeature(AppFeatures.BANKING) && !isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-screen w-full flex flex-col items-center justify-center gap-y-4"
            >
                <h2 className="text-2xl font-semibold">
                    Banking Features Required
                </h2>
                <p className="text-muted-foreground text-sm">
                    Upgrade your account to access banking features
                </p>
                <Button 
                    onClick={() => triggerPaywall(AppFeatures.BANKING)}
                >
                    Upgrade Now
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            >
            {/* Mobile Navigation */}
            {isMobile && (
                <div className="sticky top-0 z-50 bg-background border-b">
                    <nav className="flex overflow-x-auto no-scrollbar">
                        {MOBILE_TABS.map((tab) => (
                            <Button
                                key={tab.path}
                                onClick={() => router.push(tab.path)}
                                variant="ghost"
                                className={cn(
                                    "flex-1 px-4 py-3 text-sm rounded-none font-medium whitespace-nowrap",
                                    "border-b-2 transition-colors",
                                    pathname === tab.path
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground"
                                )}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </nav>
                </div>
            )}
            <Header>
                <WelcomeMsg />
                <Filters/>
            </Header>
            {children}
        </motion.div>
    )
}

export default BankingLayout;