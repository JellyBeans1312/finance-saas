'use client';

import { DataTable } from '@/components/DataTable';
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent 
} from '@/components/ui/card';

import { columns } from './columns';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetInvoices } from '@/features/invoices/api/use-get-invoices';
import { useBulkDeleteInvoices } from '@/features/invoices/api/use-bulk-delete-invoice';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';


export default function InvoiceOverviewPage() {
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
                            <CardContent>
                                <div className="h-[500px] w-full flex items-center justify-center">
                                    <Loader2  className='size-8 text-slate-300 animate-spin'/>
                                </div>
                            </CardContent>
                    </CardHeader>
                </Card>
            </div>
        )
    }
    return (
        <>       
            <Card className='max-w-screen-2xl mx-auto w-full border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Invoices
                    </CardTitle>
                        <Button size='sm' onClick={() => router.push('/sales/invoices/create')}>
                            <Plus className='size-4 mr-2'/>
                            Add New
                        </Button>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </>
    ) 
};