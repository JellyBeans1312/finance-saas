'use client';

import { cn } from '@/lib/utils';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
 } from '@/components/ui/card';
 import { Skeleton } from '@/components/ui/skeleton';
 import { Separator } from '@/components/ui/separator';


import { Loader2 } from 'lucide-react';

import { PlaidConnect } from '@/features/plaid/components/plaid-connect';
import { PlaidDisconnect } from '@/features/plaid/components/plaid-disconnect';
import { useGetConnectedBank } from '@/features/plaid/api/use-get-connected-bank';

import { SubscriptionCheckout } from '@/features/subscriptions/components/SubscriptionCheckout';
import { useGetSubscription } from '@/features/subscriptions/api/use-get-subscription';

export const SettingsCard = () => {
    const {
        data: connectedBank,
        isLoading: isLoadingConnectedBank
    } = useGetConnectedBank();

    const {
        data: currentSubscription,
        isLoading: isLoadingSubscription
    } = useGetSubscription();

    if (isLoadingConnectedBank) {
        return (
            <Card className='border-none drop-shadow-sm'>
                <CardHeader>
                    <CardTitle className='text-xl line-clamp-1'>
                        <Skeleton className='h-6 w-24' />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-[350px] w-full flex items-center justify-center'>
                        <Loader2 className='size-6 text-slate-300 animate-spin' />
                    </div>
                </CardContent>
            </Card>
        )
    };

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
                        {connectedBank 
                         ? <PlaidDisconnect />
                         : <PlaidConnect />
                        }
                    </div>
                </div>
                {}
                <Separator/>
                <div className='flex flex-col gap-y-2 lg:flex-row items-center py-4'>
                    <p className='text-sm font-medium w-full lg:w-[16.5rem]'>
                        Subscription
                    </p>
                    <div className='w-full flex item-center justify-between'>
                        <div className={cn(
                            'text-sm truncate flex items-center',
                            !currentSubscription && 'text-foreground-muted'
                        )}>
                            {currentSubscription 
                                ? `Subscription ${currentSubscription.status}`
                                : "No Subscription active"
                            }
                        </div>
                            <SubscriptionCheckout />
                    </div>
                </div>
            </CardContent>
        </Card> 
    )
}