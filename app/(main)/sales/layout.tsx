'use client';

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { AppFeatures } from "@/db/schema";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";

import { WelcomeMsg } from "@/components/layout/WelcomeMsg";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { useMediaQuery } from "@/hooks/use-media-query";

const MOBILE_TABS = [
    { label: "Invoices", path: "/sales/invoices" },
    { label: "Estimates", path: "/sales/estimates" },
    { label: "Customers", path: "/sales/customers" },
    { label: "Payments", path: "/sales/payments" },
]

type Props = {
    children: React.ReactNode
}

const SalesLayout = ({children} : Props) => {
    const { shouldBlockFeature, triggerPaywall, isLoading } = usePaywall();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();
    const pathname = usePathname();

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="size-6 animate-spin" />
            </div>
        );
    }

    if (shouldBlockFeature(AppFeatures.SALES)) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-y-4">
                <h2 className="text-2xl font-semibold">
                    Sales Features Required
                </h2>
                <p className="text-muted-foreground text-sm">
                    Upgrade your account to access sales features
                </p>
                <Button 
                    onClick={() => triggerPaywall(AppFeatures.SALES)}
                >
                    Upgrade Now
                </Button>
            </div>
        );
    }

    return ( 
        <>
        <main className="w-full">
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
                </Header>
            {children}
        </main>
        </>
    )
}

export default SalesLayout;