import { InferResponseType } from 'hono';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';
import { AppFeatures } from '@/db/schema';

type ResponseType = InferResponseType<typeof client.api.subscriptions.checkout["$post"], 200>

export const useCheckoutSubscription = () => {
    const mutation = useMutation<
        ResponseType,
        Error,
        { feature: AppFeatures }
    >({
        mutationFn: async ({ feature }) => {
            const response = await client.api.subscriptions.checkout.$post({
                json: { feature }
            });

            if(!response.ok) {
                throw Error("Failed to create URL")
            }
            
            return await response.json();
        },
        onSuccess: ({ data }) => {
            window.location.href = data;
        },
        onError: () => {
            toast.error("Failed to create subscription URL")
        }
    });
    return mutation
};