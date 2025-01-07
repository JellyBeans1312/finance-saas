import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { client } from '@/lib/hono';

export const useCancelSubscription = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
            const response = await client.api.subscriptions.cancel.$post();
            
            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }
            
            return response.json();
        },
        onSuccess: () => {
            toast.success('Subscription cancelled successfully');
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
        },
        onError: () => {
            toast.error('Failed to cancel subscription');
        }
    });
};