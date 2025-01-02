import { InferResponseType } from 'hono';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.plaid['create-update-link-token']['$post'], 200>

export const useCreateUpdateLinkToken = () => {
    const mutation = useMutation<
        ResponseType, 
        Error, 
        { bankId: string }
    >({
        mutationFn: async ({ bankId }) => {
            const response = await client.api.plaid['create-update-link-token'].$post({
                json: { bankId }
            });

            if(!response.ok) {
                const errorData = await response.json() as { error: string };
                throw new Error(errorData.error || "Failed to create update token");
            }
            return response.json();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return mutation;
};