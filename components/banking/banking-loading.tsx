'use client';

import { useMediaQuery } from "@/hooks/use-media-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const BankingLoadingSkeleton = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="space-y-6 px-4 md:px-10">
      {/* Mobile Tab Skeleton */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-background border-b">
          <div className="flex">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="flex-1 h-10" />
            ))}
          </div>
        </div>
      )}
      
      {/* Content Skeleton */}
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
};