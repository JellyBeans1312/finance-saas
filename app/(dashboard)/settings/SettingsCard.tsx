'use client';

import { cn } from '@/lib/utils';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
 } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';
import { PlaidConnect } from '@/features/plaid/components/plaid-connect';

export const SettingsCard = () => {
    const connectedBank = null;

    return (
        <Card className='border-none drop-shadow-sm'>
            <CardHeader>
                <CardTitle className='text-xl line-clamp-1'>
                    Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Separator/>
                <div className='flex flex-col gap-y-2 lg:flex-row items-center py-4'>
                    <p className='text-sm font-medium w-full lg:w-[16.5rem]'>
                        Bank Account
                    </p>
                    <div className='w-full flex item-center justify-between'>
                        <div className={cn(
                            'text-sm truncate flex items-center',
                            !connectedBank && 'text-foreground-muted'
                        )}>
                            {connectedBank 
                                ? "Bank Account Connected"
                                : "No Bank Acccount Connected"
                            }
                        </div>
                        <PlaidConnect/>
                    </div>
                </div>
            </CardContent>
        </Card> 
    )
}