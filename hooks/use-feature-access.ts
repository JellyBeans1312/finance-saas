import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';
import { AppFeatures } from '@/db/schema';

export function useFeatureAccess() {
    const { data: subscription } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const response = await client.api.subscriptions.current.$get();

            if(!response.ok) {
                throw new Error("Failed to fetch subscription")
            }

            const { data } = await response.json();
            return data;
        },
    });

    const hasFeature = (feature: AppFeatures) => {
        return subscription?.features?.includes(feature) ?? false;
    };

    return {
        hasFeature,
        subscription,
    };
}   