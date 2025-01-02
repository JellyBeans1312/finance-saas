'use client';
import { Button } from '@/components/ui/button';

import { useDeleteConnectedBank } from '@/features/plaid/api/use-delete-connected-bank';
import { useConfirm } from '@/hooks/use-confirm';

interface PlaidDisconnectProps {
    onSuccess: () => void;
}

export const PlaidDisconnect = ({ onSuccess }: PlaidDisconnectProps) => {
    const [ConfirmationDialog, confirm ] = useConfirm(
        'Are you sure?',
        'This will disconnect your bank account and remove all asssociated data.'
    )
    const disconnectBank = useDeleteConnectedBank();

    const onClick = async () => {
        const ok = await confirm()
        if(ok) {
            disconnectBank.mutate();
            onSuccess?.();
        }
    }
    return (
        <>
        <ConfirmationDialog />
        <Button 
            onClick={onClick}
            size={"sm"}
            variant={"ghost"}
            disabled={disconnectBank.isPending}
        >
            Disconnect
        </Button>
        </>
    )
};
