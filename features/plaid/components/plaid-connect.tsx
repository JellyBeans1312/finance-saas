'use client';

import { useMount } from 'react-use';
import { useState } from 'react';

import { toast } from 'sonner';
import { usePlaidLink } from 'react-plaid-link';

import { Button } from '@/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from '@/components/ui/dialog';

import { useCreateLinkToken } from '@/features/plaid/api/use-create-link-token';
import { useExchangePublicToken } from '@/features/plaid/api/use-exchange-public-token';

export const PlaidConnect = () => {
    const [ token, setToken ] = useState<string | null>(null);
    const [showConsent, setShowConsent] = useState(false);

    const createLinkToken = useCreateLinkToken();
    const exchangePublicToken = useExchangePublicToken();

    useMount(() => {
        createLinkToken.mutate(undefined, {
            onSuccess: ({ data }) => {
                setToken(data)
            },
        });

    })
    const plaid = usePlaidLink({
        token: token,
        onSuccess: (publicToken) => {
            exchangePublicToken.mutate({ publicToken })
        },
        onExit: (err, metadata) => {
            if(err != null) {
                toast.error(err.error_message || 'An error occurred')
            }
            if(metadata != null) {
                console.log(metadata)
            }
        },
        onEvent: (eventName, metadata) => {
            console.log(`Event: ${eventName}, Metadata: ${JSON.stringify(metadata)}`);
        },
        env: process.env.NEXT_PUBLIC_PLAID_ENV || 'sandbox',
    });

    const isDisabled = 
    !plaid.ready ||
    exchangePublicToken.isPending

    const onConnectClick = () => {
        setShowConsent(true);
    };

    const onAcceptConsent = () => {
        setShowConsent(false);
        plaid.open();
    };

    return (
        <>
            <Button 
                onClick={onConnectClick}
                size={"sm"}
                variant={"ghost"}
                disabled={isDisabled}
            >
                Connect
            </Button>

            <Dialog open={showConsent} onOpenChange={setShowConsent}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Connect Your Bank Account</DialogTitle>
                        <DialogDescription className="space-y-4">
                            <p>
                                By clicking "Accept", you agree to allow FinSync to:
                            </p>
                            <ul className="list-disc pl-4 space-y-2">
                                <li>Connect to your bank account</li>
                                <li>Access your transaction data</li>
                                <li>Maintain access until you disconnect</li>
                            </ul>
                            <p className="text-sm text-muted-foreground">
                                We partner with Plaid to securely connect to your bank. 
                                By proceeding, you agree to the <a href="https://plaid.com/legal" target="_blank" rel="noopener noreferrer" className="underline">Plaid End User Privacy Policy</a>.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConsent(false)}>
                            Cancel
                        </Button>
                        <Button onClick={onAcceptConsent}>
                            Accept & Connect
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
};
