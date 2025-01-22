'use client';

import { Suspense } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, ChevronRight } from 'lucide-react';

import { DataTable } from '@/components/DataTable';
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { columns } from './columns';
import InvoicesPageSkeleton from './loading';

import { useGetInvoices } from '@/features/invoices/api/use-get-invoices';
import { useBulkDeleteInvoices } from '@/features/invoices/api/use-bulk-delete-invoice';
import { InvoiceStatus } from '@/features/invoices/types';
import { Invoice } from '@/features/invoices/types';

import { useMediaQuery } from '@/hooks/use-media-query';

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


export default function InvoiceOverviewPage() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();
    const { data: invoices, isLoading: isLoadingInvoices } = useGetInvoices();
    const { mutate: deleteInvoices, isPending: isDeletingInvoices } = useBulkDeleteInvoices();
    
    const isDisabled = isLoadingInvoices || isDeletingInvoices;


    return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-screen-2xl mx-auto w-full px-10 pb-10 -mt-24"
            >
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
                    <AnimatePresence mode="wait">
                        {isMobile ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {invoices?.map((invoice) => (
                                    <InvoiceCard key={invoice.id} invoice={invoice} />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
    );
};