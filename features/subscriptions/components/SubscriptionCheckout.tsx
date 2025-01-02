import { cn } from "@/lib/utils";
import { AppFeatures } from '@/db/schema';

import { useFeatureAccess } from '@/hooks/use-feature-access';

import { useCheckoutSubscription } from "@/features/subscriptions/api/use-checkout-subscription";
import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { useSubscriptionModal } from "@/features/subscriptions/hooks/use-subscription-modal";

import { Button } from '@/components/ui/button';
interface SubscriptionCheckoutProps {
    feature: AppFeatures;
    bankConnection?: boolean;
}

export const SubscriptionCheckout = ({ feature, bankConnection }: SubscriptionCheckoutProps) => {
    const { onOpen } = useSubscriptionModal();
    const { hasFeature } = useFeatureAccess();
    const {
        data: currentSubscription,
        isLoading: isLoadingSubscription
    } = useGetSubscription();

    return (
        <Button
            onClick={() => onOpen(feature)}
            disabled={isLoadingSubscription}
            variant={hasFeature(feature) ? "outline" : "default"}
            className={cn(bankConnection ? 'w-auto' : 'w-full')}
        >
            {hasFeature(feature) 
                ? "Manage Subscription" 
                : `Upgrade to ${feature.toLowerCase()} features`
            }
        </Button>
    )
}