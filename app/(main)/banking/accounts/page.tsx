'use client'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete-accounts';
import { Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";

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
import { AccountCard } from '@/components/account-card';
import { useMediaQuery } from '@/hooks/use-media-query';
import AccountsPageSkeleton from './loading';

const LoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className='space-y-4'
  >
    {[1,2,3].map((i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-[20px]" />
          </div>
        </CardContent>
      </Card>
    ))}
  </motion.div>
);

const AccountsPage = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const newAccount = useNewAccount();
    const deleteAccounts = useBulkDeleteAccounts()
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];

    const isDisabled = 
      accountsQuery.isLoading ||
      deleteAccounts.isPending;

    return (
      <Suspense fallback={<AccountsPageSkeleton />}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'
        >
          <Card className='border-none drop-shadow-sm'>
            <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
              <div className="flex items-center justify-between w-full">
                <CardTitle className='text-xl line-clamp-1'>
                  Accounts
                </CardTitle>
                <Button 
                  size={isMobile ? 'icon' : 'sm'} 
                  onClick={newAccount.onOpen}
                  disabled={isDisabled}
                >
                  <Plus className='size-4' />
                  {!isMobile && <span className="ml-2">Add New</span>}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {accountsQuery.isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {isMobile ? (
                      <div className="space-y-4">
                        {accounts.map((account: any) => (
                          <AccountCard 
                            key={account.id} 
                            account={account}
                            onEdit={() => newAccount.onOpen()}
                            onDelete={(id) => deleteAccounts.mutate({ ids: [id] })}
                          />
                        ))}
                      </div>
                    ) : (
                      <DataTable 
                        columns={columns} 
                        data={accounts} 
                        filterKey={'name'}
                        onDelete={(row) => {
                          const ids = row.map((r) => r.original.id)
                          deleteAccounts.mutate({ ids }) 
                        }} 
                        disabled={isDisabled}
                      /> 
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </Suspense>
    );
};

export default AccountsPage