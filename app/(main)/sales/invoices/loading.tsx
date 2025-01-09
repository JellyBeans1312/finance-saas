'use client';

import { useMediaQuery } from "@/hooks/use-media-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TableLoadingSkeleton = () => (
    <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted">
                    <tr className="border-b transition-colors">
                        {[...Array(7)].map((_, i) => (
                            <th key={i} className="h-12 px-4">
                                <Skeleton className="h-4 w-[80px]" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(8)].map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-b transition-colors">
                            {[...Array(7)].map((_, colIndex) => (
                                <td key={colIndex} className="p-4">
                                    <Skeleton className="h-4 w-[80px]" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const MobileLoadingSkeleton = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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
                    <Skeleton className="h-4 w-32 mt-2" />
                </CardContent>
            </Card>
        ))}
    </div>
);

export default function InvoicesPageSkeleton() {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        <Skeleton className="h-6 w-48" />
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button size={isMobile ? 'icon' : 'sm'} disabled className="w-3/4 lg:w-auto">
                            Add New
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isMobile ? <MobileLoadingSkeleton /> : <TableLoadingSkeleton />}
                </CardContent>
            </Card>
        </div>
    );
}