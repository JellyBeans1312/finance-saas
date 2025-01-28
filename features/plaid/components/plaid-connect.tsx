'use client';

import { useMount } from 'react-use';
import { useState, useEffect } from 'react';

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
        onSuccess: (publicToken, metadata) => {
            console.log('Link success', {
                link_session_id: metadata?.link_session_id,
                institution_id: metadata?.institution?.institution_id,
                institution_name: metadata?.institution?.name,
                accounts: metadata?.accounts.map((account) => account.id),
            })
            if(metadata.institution) {
                exchangePublicToken.mutate({ 
                    publicToken,
                    institutionId: metadata.institution.institution_id,
                    linkSessionId: metadata.link_session_id,
                 })
            }
        },
        onExit: (err, metadata) => {
            console.log('Link exit', {
                link_session_id: metadata?.link_session_id,
                institution_id: metadata?.institution?.institution_id,
                institution_name: metadata?.institution?.name,
                status: metadata?.status,
                error: err
            });

            if(err != null) {
                toast.error(err.error_message || 'An error occurred')
            }

            if(metadata?.status === 'requires_credentials' || metadata?.status === 'requires_selections') {
                localStorage.setItem('plaid_incomplete_connection', JSON.stringify({
                    timestamp: new Date().toISOString(),
                    status: metadata?.status,
                    institution_id: metadata?.institution?.institution_id,
                }));
            };
                
            if(metadata?.status === 'requires_credentials') {
                console.log('User exited during credentials step');
            } else if(metadata?.status === 'requires_selections') {
                console.log('User exited during account selection');
            }
        },
        onEvent: (eventName, metadata) => {
            const eventData = {
                name: eventName,
                link_session_id: metadata.link_session_id,
                request_id: metadata.request_id,
                error_code: metadata.error_code,
                error_message: metadata.error_message,
                error_type: metadata.error_type,
                timestamp: new Date().toISOString(),
            }
            console.log('Plaid Event:', eventData);

            switch(eventName) {
                case 'OPEN':
                    console.log('User started Link flow');
                    break;
                case 'EXIT':
                    console.log('User exited Link flow');
                    break;
                case 'HANDOFF':
                    console.log('User handed off to bank');
                    break;
                case 'SELECT_INSTITUTION':
                    console.log('User selected institution');
                    break;
            }
        },
        env: process.env.NEXT_PUBLIC_PLAID_ENV || 'sandbox',
    });

    // check for incomplete connections
    useEffect(() => {
        const incompleteConnection = localStorage.getItem('plaid_incomplete_connection');
        if (incompleteConnection) {
            const data = JSON.parse(incompleteConnection);
            const timestamp = new Date(data.timestamp);
            const hoursSinceAttempt = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60);

            if (hoursSinceAttempt < 24) {
                toast.message(`Complete your ${data.institution} connection`, {
                    description: "Finish connecting your account to unlock all features.",
                    action: {
                        label: "Connect Now",
                        onClick: () => {
                            localStorage.removeItem('plaid_incomplete_connection');
                            onConnectClick();
                        }
                    }
                });
            } else {
                localStorage.removeItem('plaid_incomplete_connection');
            }
        }
    }, []);

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
                        <DialogTitle>Securely Connect Your Bank</DialogTitle>
                        <DialogDescription className="space-y-4">
                            <p className="font-medium text-primary">
                                Get started with automatic transaction tracking and financial insights
                            </p>
                            <p>
                                By connecting your bank account, you'll be able to:
                            </p>
                            <ul className="list-disc pl-4 space-y-2">
                                <li>Automatically import and categorize transactions</li>
                                <li>Get real-time balance updates</li>
                                <li>Track your spending patterns effortlessly</li>
                                <li>Save hours of manual data entry</li>
                            </ul>
                            <p className="text-sm text-muted-foreground">
                                Your security is our priority. We use Plaid's bank-level encryption to keep your data safe.
                                By proceeding, you agree to the <a href="https://plaid.com/legal" target="_blank" rel="noopener noreferrer" className="underline">Plaid End User Privacy Policy</a>.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConsent(false)}>
                            Cancel
                        </Button>
                        <Button onClick={onAcceptConsent}>
                            Securely Connect
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
};
