import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.invoices['send-invoice']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.invoices['send-invoice']['$post']>["json"]

export const useSendInvoice = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.invoices['send-invoice']['$post']({ json });

            if (!response.ok) {
                throw new Error("Failed to send invoice");
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success("Invoice Sent")
            queryClient.invalidateQueries({ queryKey: ["invoices"]});
            queryClient.invalidateQueries({ queryKey: ["invoice", data?.id]});
            queryClient.invalidateQueries({ queryKey: ["transactions"]});
        },
        onError: (error) => {
            toast.error("Failed to Send Invoice")
            console.log(error)
        }
    });
    return mutation
};