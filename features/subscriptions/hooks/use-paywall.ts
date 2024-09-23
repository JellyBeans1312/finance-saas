import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { useSubscriptionModal } from "@/features/subscriptions/hooks/use-subscription-modal";

export const usePaywall = () => {
    const subscriptionModal = useSubscriptionModal();
    const {
        data: currentSubscription,
        isLoading: isLoadingSubscription       
    } = useGetSubscription();

    const shouldBlock = !currentSubscription || currentSubscription.status === "expired";

    return {
        isLoading: isLoadingSubscription, 
        shouldBlock,
        triggerPaywall: () => {
            subscriptionModal.onOpen();
        },
    };
}