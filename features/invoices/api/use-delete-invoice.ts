import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.invoices[":id"]["$delete"]>

export const useDeleteInvoice = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.invoices[":id"]["$delete"]({ 
                param: { id },
             });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Invoice Deleted")
            queryClient.invalidateQueries({ queryKey: ["invoice", { id }] });
            queryClient.invalidateQueries({ queryKey: ["invoices"]});
        },
        onError: () => {
            toast.error("Failed to Delete Invoice")
        }
    });
    return mutation
};