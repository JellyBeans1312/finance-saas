'use client';

import { PageSkeleton } from "@/components/page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DataGridSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardContent className="p-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-7 w-[180px]" />
                        <div className="flex items-center gap-2 pt-2">
                            <Skeleton className="h-3 w-[60px]" />
                            <Skeleton className="h-3 w-[40px]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

const ChartsSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-5 w-[140px]" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        ))}
    </div>
);

export default function SalesOverviewSkeleton() {
    return (
        <PageSkeleton>
            <div className="space-y-6">
                <DataGridSkeleton />
                <ChartsSkeleton />
            </div>
        </PageSkeleton>
    );
}