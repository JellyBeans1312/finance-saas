import { useMediaQuery } from '@/hooks/use-media-query';
import { InvoiceDataDisplay } from '@/components/sales/invoice-data-display';
import { Invoice } from '@/features/invoices/types';
import Image from 'next/image';
interface InvoiceDetailsProps {
    invoice: Invoice;
    message?: string;
}

export const InvoiceDetails = ({ invoice, message }: InvoiceDetailsProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                {invoice?.imageUrl && (
                    <Image 
                        src={invoice.imageUrl} 
                        alt="Company Logo" 
                        className="w-20 h-20 object-contain" 
                        width={80}
                        height={80}
                    />
                )}
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">From</h2>
                    <div className="space-y-1">
                        <p className="font-medium">{invoice.fromName}</p>
                        <p className="text-sm text-muted-foreground">{invoice.fromAddress}</p>
                        <p className="text-sm text-muted-foreground">{invoice.fromEmail}</p>
                        {invoice.fromPhone && (
                            <p className="text-sm text-muted-foreground">{invoice.fromPhone}</p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">To</h2>
                    <div className="space-y-1">
                        <p className="font-medium">{invoice.clientName}</p>
                        <p className="text-sm text-muted-foreground">{invoice.toAddress}</p>
                        <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>
                        {invoice.clientPhone && (
                            <p className="text-sm text-muted-foreground">{invoice.clientPhone}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Invoice Data */}
            <InvoiceDataDisplay 
                invoice={invoice} 
                variant={isMobile ? 'mobile' : 'desktop'} 
            />

            {/* Notes */}
            {invoice.notes && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Notes</h2>
                    <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                </div>
            )}
        </div>
    );
};   