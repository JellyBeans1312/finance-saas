import { useCheckoutSubscription } from "@/features/subscriptions/api/use-checkout-subscription";
import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";

import { Button } from '@/components/ui/button';

export const SubscriptionCheckout = () => {
    const checkout = useCheckoutSubscription();
    const {
        data: currentSubscription,
        isLoading: isLoadingSubscription
    } = useGetSubscription();

    return (
        <Button
            onClick={() => checkout.mutate()}
            disabled={isLoadingSubscription}
            variant={"ghost"}
            size={"sm"}
        >
            {currentSubscription ? "Manage" : "Upgrade"}
        </Button>
    )
}