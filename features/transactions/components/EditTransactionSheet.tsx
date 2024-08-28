
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';


import { TransactionForm } from '@/features/transactions/components/TransactionForm';

import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';

import { useCreateAccount } from '@/features/accounts/api/use-create-account';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';

import { useConfirm } from '@/hooks/use-confirm';


import { 
    Sheet,
    SheetContent,
    SheetDescription, 
    SheetHeader, 
    SheetTitle
 } from '@/components/ui/sheet';

import { insertTransactionSchema } from '@/db/schema';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { convertAmountFromMiliunites } from '@/lib/utils';

const formSchema = insertTransactionSchema.omit({
    id: true,
});

type FormValues = z.input<typeof formSchema>


export const EditTransactionSheet = () => {
    const { id, isOpen, onClose} = useOpenTransaction();
    const [ ConfirmationDialog, confirm ] = useConfirm(
        "Are you sure?",
        "You are about to delete the transaction."
    )
    
    const transactionQuery = useGetTransaction(id);
    const editMutation = useEditTransaction(id);
    const deleteMutation = useDeleteTransaction(id);

    const categoryMutation = useCreateCategory();
    const categoryQuery = useGetCategories();
    const onCreateCategory = (name: string) => categoryMutation.mutate({
        name
    });
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const accountMutation = useCreateAccount();
    const accountQuery = useGetAccounts();
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    });
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }));
    
    const isPending = 
    editMutation.isPending || 
    deleteMutation.isPending ||
    transactionQuery.isLoading || 
    categoryMutation.isPending || 
    accountMutation.isPending 
    
    const isLoading = 
    transactionQuery.isLoading ||
    categoryQuery.isLoading || 
    accountQuery.isLoading;

    const amountFromMiliunits = convertAmountFromMiliunites(transactionQuery.data ? transactionQuery.data.amount : 0);
    
    const defaultValues = transactionQuery.data ? { 
        amount: amountFromMiliunits.toString(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
        date: transactionQuery.data.date 
        ?  new Date(transactionQuery.data.date) 
            : new Date(),
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
    } : {
        amount: "",
        payee: "",
        notes: "",
        date: new Date(),
        accountId: "",
        categoryId: "",
    }
    
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };
    
    const onDelete = async () => {
        const ok = await confirm();
    
        if(ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        };
    };

    return (
        <>
            <ConfirmationDialog />        
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading 
                    ? (
                        <div className='absolute-inset-0 flex items-center justify-center'> 
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <TransactionForm 
                            id={id}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                            defaultValues={defaultValues}
                        />
                    )
                }
                </SheetContent>
            </Sheet>
        </>
    )
 }