"use client";

import { Loader2 } from "lucide-react";
import { AppFeatures } from "@/db/schema";

import { Button } from "@/components/ui/button";

import { Filters } from "@/components/layout/Filters";
import { Header } from "@/components/layout/Header";
import { WelcomeMsg } from "@/components/layout/WelcomeMsg";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

type Props = {
    children: React.ReactNode
}

const BankingLayout = ({children} : Props) => {
    const { shouldBlockFeature, triggerPaywall, isLoading } = usePaywall();

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="size-6 animate-spin" />
            </div>
        );
    }

    if (shouldBlockFeature(AppFeatures.BANKING)) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center gap-y-4">
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
            </div>
        );
    }

    return (
        <>
            <Header>
                <WelcomeMsg />
                <Filters/>
            </Header>
            {children}
        </>
    )
}

export default BankingLayout;