import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.invoices[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.invoices[":id"]["$patch"]>["json"]

export const useEditInvoice = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.invoices[":id"]["$patch"]({ 
                param: { id },
                json,
             });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Invoice Updated")
            queryClient.invalidateQueries({ queryKey: ["invoice", { id }] });
            queryClient.invalidateQueries({ queryKey: ["invoices"]});
        },
        onError: () => {
            toast.error("Failed to Edit Invoice")
        }
    });
    return mutation
};