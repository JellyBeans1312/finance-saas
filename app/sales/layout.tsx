'use client';

import { Loader2 } from "lucide-react";
import { AppFeatures } from "@/db/schema";

import { Button } from "@/components/ui/button";

import { Header } from "@/components/layout/Header";
import { WelcomeMsg } from "@/components/layout/WelcomeMsg";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";


type Props = {
    children: React.ReactNode
}

const SalesLayout = ({children} : Props) => {
    const { shouldBlockFeature, triggerPaywall, isLoading } = usePaywall();

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="size-6 animate-spin" />
            </div>
        );
    }

    if (shouldBlockFeature(AppFeatures.SALES)) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center gap-y-4">
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
            <Header>
                <WelcomeMsg />
            </Header>
            {children}
        </main>
        </>
    )
}

export default SalesLayout;