import { InferResponseType } from 'hono';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';
import { Invoice } from '../types';

type ResponseType = InferResponseType<typeof client.api.invoices['generate-pdf']['$post'], 200>

export const useDownloadInvoice = () => {

    const mutation = useMutation<
        ResponseType,
        Error,
        Invoice
    >({
        mutationFn: async (invoice: Invoice) => {
            try {
                const formattedInvoice = {
                    ...invoice,
                    issueDate: invoice.issueDate.toString(),
                    dueDate: invoice.dueDate.toString(),
                    createdAt: invoice.createdAt.toString(),
                    updatedAt: invoice.updatedAt.toString(),    
                }
                const response = await fetch('/api/invoices/generate-pdf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ invoice: formattedInvoice }),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to download PDF: ${errorText}`);
                }
                // get filename from response
                const contentDisposition = response.headers.get('Content-Disposition');
                const filename = contentDisposition
                    ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                    : `invoice-${invoice.invoiceNumber}.pdf`;
                
                // get pdf buffer
                const pdfBuffer = await response.arrayBuffer();
                
                // create blob
                const blob = new Blob([pdfBuffer], { 
                    type: response.headers.get('Content-Type') || 'application/pdf'
                });
                // download pdf
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
    
                return { success: true };
            } catch(error) {
                console.error('Download Error:', error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Invoice PDF Downloaded")
        },
        onError: () => {
            toast.error("Failed to Download Invoice PDF")
        }
    });
    return mutation
};