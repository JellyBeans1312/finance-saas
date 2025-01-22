import { useMediaQuery } from '@/hooks/use-media-query';
import { Skeleton } from "@/components/ui/skeleton";

export const InvoiceDetailsSkeleton = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="space-y-6 animate-pulse">
            {/* Header with Logo Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <Skeleton className="w-20 h-20 rounded" />
            </div>

            {/* Addresses Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Address */}
                <div className="space-y-2">
                    <Skeleton className="h-7 w-16" /> {/* "From" heading */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-36" /> {/* Name */}
                        <Skeleton className="h-4 w-48" /> {/* Address */}
                        <Skeleton className="h-4 w-40" /> {/* Email */}
                        <Skeleton className="h-4 w-32" /> {/* Phone */}
                    </div>
                </div>

                {/* To Address */}
                <div className="space-y-2">
                    <Skeleton className="h-7 w-12" /> {/* "To" heading */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-36" /> {/* Client Name */}
                        <Skeleton className="h-4 w-48" /> {/* Address */}
                        <Skeleton className="h-4 w-40" /> {/* Email */}
                        <Skeleton className="h-4 w-32" /> {/* Phone */}
                    </div>
                </div>
            </div>

            {/* Invoice Data Skeleton */}
            {isMobile ? (
                // Mobile layout
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                    {/* Line Items */}
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Desktop layout
                <div className="space-y-4">
                    {/* Header Row */}
                    <div className="grid grid-cols-4 gap-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                    {/* Line Items */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="grid grid-cols-4 gap-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            )}

            {/* Notes Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-7 w-20" /> {/* "Notes" heading */}
                <Skeleton className="h-16 w-full" /> {/* Notes content */}
            </div>
        </div>
    );
};