'use client'
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
    title?: string;
    description?: string;
    className?: string;
}

export const ComingSoon = ({
    title = "Coming Soon",
    description = "We're working hard to bring you this feature. Stay tuned!",
    className
}: ComingSoonProps) => {
    return (
        <div className={cn(
            "h-full w-full flex flex-col items-center justify-center gap-y-4",
            className
        )}>
            <div className="p-4 bg-muted rounded-full">
                <CalendarClock className="size-6 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold">
                {title}
            </h2>
            <p className="text-muted-foreground text-sm text-center max-w-[300px]">
                {description}
            </p>
            <Button
                variant="secondary"
                onClick={() => window.history.back()}
            >
                Go Back
            </Button>
        </div>
    );
}; 