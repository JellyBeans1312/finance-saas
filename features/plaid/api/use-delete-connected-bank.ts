import { InferResponseType } from 'hono';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';


import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.plaid['connected-bank']['$delete'], 200>

export const useDeleteConnectedBank = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async (json) => {
            const response = await client.api.plaid['connected-bank'].$delete();

            if(!response.ok) {
                throw Error("Failed to disconnect from bank")
            }
            
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Disconnected from bank")
            queryClient.invalidateQueries({ queryKey: ['connected-bank']})
            queryClient.invalidateQueries({ queryKey: ['transactions']})
            queryClient.invalidateQueries({ queryKey: ['accounts']})
            queryClient.invalidateQueries({ queryKey: ['categories']})
            queryClient.invalidateQueries({ queryKey: ['summary']})
        },
        onError: () => {
            toast.error("Failed to disconnect from bank")
        }
    });
    return mutation
};