import { AppFeatures } from "@/db/schema";
import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { useSubscriptionModal } from "@/features/subscriptions/hooks/use-subscription-modal";
import { useFeatureAccess } from "@/hooks/use-feature-access";

export const usePaywall = () => {
    const subscriptionModal = useSubscriptionModal();
    const { hasFeature } = useFeatureAccess();
    const {
        data: currentSubscription,
        isLoading: isLoadingSubscription       
    } = useGetSubscription();

    const shouldBlockFeature = (feature: AppFeatures) => {
        // If subscription is expired, block all features
        if (currentSubscription?.status === "expired") {
            return true;
        }
        
        // Check if user has access to this specific feature
        return !hasFeature(feature);
    };

    return {
        isLoading: isLoadingSubscription,
        shouldBlockFeature,
        triggerPaywall: (feature: AppFeatures) => {
            subscriptionModal.onOpen(feature);
        },
    };
};