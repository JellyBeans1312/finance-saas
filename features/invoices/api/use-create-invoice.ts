import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.invoices.$post, 200>
type RequestType = InferRequestType<typeof client.api.invoices.$post>["json"]

export const useCreateInvoice = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.invoices.$post({ json });

            if (!response.ok) {
                throw new Error("Failed to create invoice");
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success("Invoice Created")
            queryClient.invalidateQueries({ queryKey: ["invoices"]});
            queryClient.invalidateQueries({ queryKey: ["invoice", data?.id]});
            queryClient.invalidateQueries({ queryKey: ["transactions"]});
        },
        onError: () => {
            toast.error("Failed to Create Invoice")
        }
    });
    return mutation
};