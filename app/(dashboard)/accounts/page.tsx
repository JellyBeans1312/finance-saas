'use client'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useBulkDelete } from '@/features/accounts/api/use-bulk-delete';


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

const AccountsPage = () => {
    const newAccount = useNewAccount();
    const deleteAccounts = useBulkDelete()
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];

    const isDisabled = 
    accountsQuery.isLoading ||
    deleteAccounts.isPending;

    if(accountsQuery.isLoading) {
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
                        Accounts Page
                    </CardTitle>
                        <Button size='sm' onClick={newAccount.onOpen}>
                            <Plus className='size-4 mr-2'/>
                            Add New
                        </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={columns} 
                        data={accounts} 
                        filterKey={'select'}
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteAccounts.mutate({ ids }) 
                        }} 
                        disabled={isDisabled} /> 
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountsPage