'use client';

import { useMediaQuery } from "@/hooks/use-media-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const MobileLoadingSkeleton = () => (
    <div className="space-y-4 -mt-24">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <Skeleton className="h-5 w-24 mb-1" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

const DesktopLoadingSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 -mt-24">
        {[...Array(4)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-5 w-[140px]" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[200px] w-full" />
                </CardContent>
            </Card>
        ))}
    </div>
);

export const DashboardSkeleton = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="space-y-6">
            <Skeleton className="h-20 w-full" /> {/* QuickActions skeleton */}
            <Skeleton className="h-28 w-full" /> {/* OverviewStats skeleton */}
            {isMobile ? <MobileLoadingSkeleton /> : <DesktopLoadingSkeleton />}
        </div>
    );
};