'use client'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions';

import { 
    Card,
    CardContent,
    CardHeader, 
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '@/components/DataTable';
import { Skeleton } from '@/components/ui/skeleton';

const TransactionsPage = () => {
    const newTransaction = useNewTransaction();
    const deleteTransactions = useBulkDeleteTransactions()
    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [];

    const isDisabled = 
    transactionsQuery.isLoading ||
    deleteTransactions.isPending;

    if(transactionsQuery.isLoading) {
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
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Transaction History
                    </CardTitle>
                        <Button size='sm' onClick={newTransaction.onOpen}>
                            <Plus className='size-4 mr-2'/>
                            Add New
                        </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={columns} 
                        data={transactions}
                        filterKey={'payee'}
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteTransactions.mutate({ ids }) 
                        }} 
                        disabled={isDisabled} /> 
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionsPage;