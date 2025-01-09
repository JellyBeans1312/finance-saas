'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton({ 
  children,
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        {/* <CardHeader>
          <Skeleton className='h-8 w-48'/>
        </CardHeader> */}
        <CardContent className={className}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}