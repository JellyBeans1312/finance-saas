'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BankingOverviewSkeleton() {
  return (
    <div className="max-w-screen-3xl mx-auto w-full px-4 md:px-10 -mt-24">
      <div className="space-y-6">
        {/* DataGrid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-7 w-[180px]" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-4 w-4 rounded-full" /> {/* Percentage indicator */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* DataCharts Skeleton */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-[140px]" />
            </CardHeader>
            <CardContent className="p-6">
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-[140px]" />
            </CardHeader>
            <CardContent className="p-6">
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}