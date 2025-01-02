'use client';

import { cn } from '@/lib/utils';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { AppFeatures } from '@/db/schema';
import { 
    Building2, 
    CreditCard, 
    ChevronRight,
    Landmark,
    Receipt, 
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Loader2 } from 'lucide-react';

import { useGetConnectedBank } from '@/features/plaid/api/use-get-connected-bank';
import { BankConnection } from '@/features/plaid/components/bank-connection';
import { SubscriptionCheckout } from '@/features/subscriptions/components/SubscriptionCheckout';
import { useGetSubscription } from '@/features/subscriptions/api/use-get-subscription';

const FEATURE_DETAILS = {
    [AppFeatures.BANKING]: {
        title: 'Banking Features',
        description: 'Connect your bank accounts and track transactions',
        icon: Landmark,
        price: '$9/month',
        features: [
            'Connect unlimited bank accounts',
            'Real-time transaction tracking',
            'CSV import/export',
            'Transaction categorization'
        ]
    },
    [AppFeatures.SALES]: {
        title: 'Sales Features',
        description: 'Create and manage invoices',
        icon: Receipt,
        price: '$12/month',
        features: [
            'Unlimited invoices',
            'Custom invoice templates',
            'Payment tracking',
            'Client management'
        ]
    }
};

export const SettingsCard = () => {
    const { hasFeature } = useFeatureAccess();
    const {
        data: connectedBank,
        isLoading: isLoadingConnectedBank
    } = useGetConnectedBank();

    const {
        data: currentSubscription,
        isLoading: isLoadingSubscription
    } = useGetSubscription();

    if (isLoadingConnectedBank || isLoadingSubscription) {
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
                                    !connectedBank && 'text-muted-foreground'
                                )}>
                                    {connectedBank?.requiresUpdate 
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
                                <div className='flex items-center justify-between'>
                                    <div className='space-y-1'>
                                        <p className={cn(
                                            'text-sm',
                                            !currentSubscription && 'text-muted-foreground'
                                        )}>
                                            {currentSubscription 
                                                ? `Subscription ${currentSubscription.status}`
                                                : "No Active Subscription"
                                            }
                                        </p>
                                        <div className='flex gap-x-2'>
                                            {Object.values(AppFeatures).map(feature => (
                                                hasFeature(feature) && (
                                                    <Badge 
                                                        key={feature}
                                                        variant="secondary"
                                                    >
                                                        {feature.toLowerCase()}
                                                    </Badge>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>
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
                                                <ul className="space-y-2 mb-4">
                                                    {details.features.map((feat, index) => (
                                                        <li key={index} className="text-sm flex items-center gap-x-2">
                                                            <ChevronRight className="size-4 text-primary" />
                                                            {feat}
                                                        </li>
                                                    ))}
                                                </ul>
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