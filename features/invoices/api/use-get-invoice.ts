import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { InvoiceStatus } from '../types';

export const useGetInvoice = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ['invoice', { id }],
        queryFn: async () => {
            const response = await client.api.invoices[":id"].$get({
                param: { id }
            });

            if(!response.ok) {
                throw new Error("Failed to fetch invoice")
            }

            const { data } = await response.json();
            return {
                ...data,
                clientPhone: data.clientPhone || undefined,
                fromPhone: data.fromPhone || undefined,
                notes: data.notes || undefined,
                imageUrl: data.imageUrl || undefined,
                issueDate: new Date(data.issueDate),
                dueDate: new Date(data.dueDate),
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
                status: data.status as InvoiceStatus,
            };
        }
    })
    return query;
}