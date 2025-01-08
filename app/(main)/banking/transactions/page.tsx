'use client'
import { useMediaQuery } from '@/hooks/use-media-query';
import { useState } from 'react';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions';

import { useSelectAccount } from '@/features/accounts/hooks/use-select-account';

import { transactions as transactionsSchema } from '@/db/schema';


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

import { UploadButton } from './UploadButton';
import { ImportCard } from './ImportCard';
import { toast } from 'sonner';
import { TransactionCard } from '@/components/transaction-card';

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESUTS = {
    data: [],
    errors: [],
    meta: {},
};

const LoadingSkeleton = () => {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const TransactionsPage = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [ variant, setVariant ] = useState<VARIANTS>(VARIANTS.LIST);
    const [ importResults, setImportResults ] = useState(INITIAL_IMPORT_RESUTS);
    
    const newTransaction = useNewTransaction();
    const createTransactions = useBulkCreateTransactions();
    const deleteTransactions = useBulkDeleteTransactions()
    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [];
        
        
    const [AccountDialog, confirm] = useSelectAccount();

    const onUpload = (results: typeof INITIAL_IMPORT_RESUTS) => {
        setImportResults(results)
        setVariant(VARIANTS.IMPORT)
    };

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESUTS);
        setVariant(VARIANTS.LIST);
    };

    const onSubmitImport = async (
        values: typeof transactionsSchema.$inferInsert[],
    ) => {
        const accountId = await confirm();

        if(!accountId) {
            return toast.error("Please select an account to continue.");
        };

        const data = values.map((value) => ({
            ...value, 
            accountId: accountId as string
        }));

        createTransactions.mutate(data, {
            onSuccess: () => onCancelImport(),
        });
    };


    const isDisabled = 
    transactionsQuery.isLoading ||
    deleteTransactions.isPending;

    if(transactionsQuery.isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader>
                        <Skeleton className='h-8 w-48'/>
                    </CardHeader>
                    <CardContent>
                        {isMobile ? (
                            <div className="space-y-4">
                                {[1,2,3].map((i) => (
                                    <LoadingSkeleton key={i} />
                                ))}
                            </div>
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

    if(variant === VARIANTS.IMPORT) {
        return (
            <>  
                <AccountDialog />
                <ImportCard 
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </>
        )
    };
    return ( 
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                <CardTitle className='text-xl line-clamp-1'>
                    Transaction History
                </CardTitle>
                <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                    <Button 
                        size={isMobile ? 'icon' : 'sm'}
                        onClick={newTransaction.onOpen}
                        className='w-3/4 lg:w-auto'
                    >
                        <Plus className='size-4' />
                        {!isMobile && <span className="ml-2">Add New</span>}
                    </Button>
                    <UploadButton onUpload={onUpload} />
                </div>
            </CardHeader>
            <CardContent>
                {isMobile ? (
                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <TransactionCard
                                key={transaction.id}
                                transaction={transaction}
                                onEdit={() => {}}
                                onDelete={(id) => deleteTransactions.mutate({ ids: [id] })}
                                onCategoryClick={(id, categoryId) => 
                                    categoryId ? 'openCategory' : 'openTransaction(id)'
                                }
                                onAccountClick={() => {}}
                            />
                        ))}
                    </div>
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={transactions}
                        filterKey='payee'
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteTransactions.mutate({ ids }) 
                        }}
                        disabled={isDisabled}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionsPage;