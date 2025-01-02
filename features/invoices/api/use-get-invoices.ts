import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { Invoice, InvoiceStatus } from '../types';

export const useGetInvoices = () => {
    const query = useQuery({
        queryKey: ['invoices'],
        queryFn: async () => {
            const response = await client.api.invoices.$get();

            if(!response.ok) {
                throw new Error("Failed to fetch invoices")
            }

            const { data } = await response.json();
            const invoices: Invoice[] = data.map((invoice: any) => ({
                ...invoice,
                clientPhone: invoice.clientPhone || undefined,
                fromPhone: invoice.fromPhone || undefined,
                notes: invoice.notes || undefined,
                imageUrl: invoice.imageUrl || undefined,
                issueDate: new Date(invoice.issueDate),
                dueDate: new Date(invoice.dueDate),
                createdAt: new Date(invoice.createdAt),
                updatedAt: new Date(invoice.updatedAt),
                status: invoice.status as InvoiceStatus,
            }));
            return invoices;
        }
    })
    return query;
}