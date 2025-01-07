'use client';

import { cn } from '@/lib/utils';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { AppFeatures } from '@/db/schema';
import { 
    Building2, 
    CreditCard, 
    Landmark,
    AlertCircle 
} from 'lucide-react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

import { Loader2 } from 'lucide-react';

import { useGetConnectedBank } from '@/features/plaid/api/use-get-connected-bank';
import { BankConnection } from '@/features/plaid/components/bank-connection';
import { SubscriptionCheckout } from '@/features/subscriptions/components/SubscriptionCheckout';
import { useGetSubscription } from '@/features/subscriptions/api/use-get-subscription';
import { FEATURE_DETAILS } from '@/features/subscriptions/subscription-constants';
import { SubscriptionStatus } from '@/features/subscriptions/components/subscription-status';
import { FeatureList } from '@/features/subscriptions/components/feature-list';
import { Subscription } from '@/features/subscriptions/types';

export const SettingsCard = () => {
    const { hasFeature } = useFeatureAccess();
    const {
        data: connectedBank,
        isLoading: isLoadingConnectedBank,
        error: bankError
    } = useGetConnectedBank();

    const {
        data: currentSubscription,
        isLoading: isLoadingSubscription
    } = useGetSubscription();

    if (isLoadingConnectedBank || isLoadingSubscription && !bankError) {
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
        <div className="space-y-6">
            <Card className='border-none drop-shadow-sm'>
                <CardHeader>
                    <CardTitle className='text-xl flex items-center gap-x-2'>
                        <Building2 className="size-5" />
                        Account Settings
                    </CardTitle>
                    <CardDescription>
                        Manage your account and subscription settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Bank Connection Section */}
                    <div>
                        <h3 className="font-medium mb-4 flex items-center gap-x-2">
                            <Landmark className="size-4" />
                            Bank Connection
                        </h3>
                        <div className='flex items-center justify-between bg-muted/50 p-4 rounded-lg'>
                            <div className='space-y-1'>
                                <p className={cn(
                                    'text-sm',
                                    !(!connectedBank || bankError) && 'text-muted-foreground'
                                )}>
                                    {bankError
                                        ? "No Bank Account Connected"
                                        : connectedBank?.requiresUpdate 
                                            ? "Bank Account Needs Update"
                                            : connectedBank 
                                                ? "Bank Account Connected"
                                                : "No Bank Account Connected"
                                    }
                                </p>
                                {connectedBank?.requiresUpdate && (
                                    <div className="flex items-center gap-x-2 text-yellow-600">
                                        <AlertCircle className="size-4" />
                                        <p className="text-xs">Action required</p>
                                    </div>
                                )}
                            </div>
                            <BankConnection />
                        </div>
                    </div>

                    {/* Subscription Section */}
                    <div>
                        <h3 className="font-medium mb-4 flex items-center gap-x-2">
                            <CreditCard className="size-4" />
                            Subscription Status
                        </h3>
                        <div className='space-y-4'>
                            <div className='bg-muted/50 p-4 rounded-lg'>
                                <SubscriptionStatus 
                                    subscription={currentSubscription as Subscription | null} 
                                />
                            </div>

                            {/* Feature Cards */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {Object.entries(FEATURE_DETAILS).map(([feature, details]) => {
                                    const isSubscribed = hasFeature(feature as AppFeatures);
                                    return (
                                        <Card key={feature} className={cn(
                                            "relative overflow-hidden",
                                            isSubscribed && "border-primary/50 bg-primary/5"
                                        )}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center justify-between">
                                                    <span className="flex items-center gap-x-2">
                                                        <details.icon className="size-5" />
                                                        {details.title}
                                                    </span>
                                                    <Badge variant={isSubscribed ? "default" : "secondary"}>
                                                        {details.price}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription>
                                                    {details.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <FeatureList 
                                                    features={Array.from(details.features)}
                                                    className="mb-4"
                                                />
                                                <SubscriptionCheckout 
                                                    feature={feature as AppFeatures}
                                                />
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}