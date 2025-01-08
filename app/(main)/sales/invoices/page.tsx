'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { DataTable } from '@/components/DataTable';
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { columns } from './columns';

import { Loader2, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetInvoices } from '@/features/invoices/api/use-get-invoices';
import { useBulkDeleteInvoices } from '@/features/invoices/api/use-bulk-delete-invoice';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { InvoiceStatus } from '@/features/invoices/types';
import { Invoice } from '@/features/invoices/types';
const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
    const router = useRouter();
    return (
        <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => router.push(`/sales/invoices/${invoice.id}`)}
    >
        <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
                <p className="font-medium">${invoice.total.toFixed(2)}</p>
                <Badge 
                    variant={invoice.status as InvoiceStatus}
                >
                    {invoice.status}
                </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                Due {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                </p>
            </CardContent>
        </Card>
    );
};

const LoadingSkeleton = () => (
    <div className='space-y-4'>
        {[1,2,3].map((i) => (
            <Card key={i}>
                <CardContent className="p-4">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[20px]" />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-[60px]" />
                            <Skeleton className="h-4 w-[80px]" />
                        </div>
                        <Skeleton className="h-4 w-[120px]" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export default function InvoiceOverviewPage() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();
    const { data: invoices, isLoading: isLoadingInvoices } = useGetInvoices();
    const { mutate: deleteInvoices, isPending: isDeletingInvoices } = useBulkDeleteInvoices();
    
    const isDisabled = isLoadingInvoices || isDeletingInvoices;

    if(isLoadingInvoices) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader>
                        <Skeleton className='h-8 w-48'/>
                    </CardHeader>
                    <CardContent>
                        {isMobile ? (
                            <LoadingSkeleton />
                        ) : (
                            <div className="h-[500px] w-full flex items-center justify-center">
                                <Loader2 className='size-8 text-slate-300 animate-spin'/>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <Card className='max-w-screen-2xl mx-auto w-full border-none drop-shadow-sm'>
            <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                <div className="flex items-center justify-between w-full">
                    <CardTitle className='text-xl line-clamp-1'>
                        Invoices
                    </CardTitle>
                    <Button 
                        size={isMobile ? 'icon' : 'sm'} 
                        onClick={() => router.push('/sales/invoices/create')}
                    >
                        <Plus className='size-4' />
                        {!isMobile && <span className="ml-2">Add New</span>}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isMobile ? (
                    <div className="space-y-4">
                        {invoices?.map((invoice) => (
                            <InvoiceCard key={invoice.id} invoice={invoice} />
                        ))}
                    </div>
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={invoices || []} 
                        filterKey='invoiceNumber'
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteInvoices({ ids }) 
                        }}
                        disabled={isDisabled}
                    />
                )}
            </CardContent>
        </Card>
    );
};