
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';


import { TransactionForm } from '@/features/transactions/components/TransactionForm';

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

const formSchema = insertTransactionSchema.omit({
    id: true,
});

type FormValues = z.input<typeof formSchema>


export const EditTransactionSheet = () => {
    const { id, isOpen, onClose} = useOpenTransaction();
    const [ ConfirmationDialog, confirm ] = useConfirm(
        "Are you sure?",
        "You are about to delete a transaction."
    )
    
    const transactionQuery = useGetTransaction(id);
    const editMutation = useEditTransaction(id);
    const deleteMutation = useDeleteTransaction(id);
    
    const isPending = 
    editMutation.isPending || 
    deleteMutation.isPending
    
    const isLoading = transactionQuery.isLoading;
    
    const defaultValues = transactionQuery.data ? { 
        amount: transactionQuery.data.amount,
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
        date: transactionQuery.data.date
    } : {
        amount: "0",
        payee: undefined,
        notes: "",
        date: Date    
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
                            Edit an existing transaction
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
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}
                        />
                    )
                }
                </SheetContent>
            </Sheet>
        </>
    )
 }