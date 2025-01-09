'use client';

import { useMediaQuery } from "@/hooks/use-media-query";
import { PageSkeleton } from "@/components/page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Card, 
    CardContent, 
    CardHeader 
} from "@/components/ui/card";

const FeatureCardSkeleton = () => (
    <Card className="relative overflow-hidden">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Skeleton className="size-5" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent>
            <div className="space-y-2 mb-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-x-2">
                        <Skeleton className="size-4" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                ))}
            </div>
            <Skeleton className="h-9 w-full" />
        </CardContent>
    </Card>
);

export default function SettingsPageSkeleton() {
    return (
        <PageSkeleton>
            <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-5" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                    <Skeleton className="h-4 w-64 mt-1" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <Skeleton className="size-4" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <div className="flex flex-col md:flex-row items-center md:justify-between bg-muted/50 p-4 rounded-lg">
                            <div className="space-y-1 w-full md:w-auto">
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-9 w-full md:w-32 mt-2 md:mt-0" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <Skeleton className="size-4" />
                            <Skeleton className="h-5 w-36" />
                        </div>
                        <div className="space-y-4">
                            <div className="bg-muted/50 p-4 flex flex-col items-center justify-center md:items-start md:justify-start rounded-lg">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32 mt-2" />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {[1, 2].map((i) => (
                                    <FeatureCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </PageSkeleton>
    );
}