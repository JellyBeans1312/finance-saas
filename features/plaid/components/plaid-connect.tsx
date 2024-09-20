'use client';

import { useMount } from 'react-use';
import { useState } from 'react';

import { usePlaidLink } from 'react-plaid-link';

import { Button } from '@/components/ui/button';
import { useCreateLinkToken } from '@/features/plaid/api/use-create-link-token';

export const PlaidConnect = () => {
    const [ token, setToken ] = useState<string | null>(null);

    const createLinkToken = useCreateLinkToken();

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
            console.log({ publicToken })
        },
        env: "sandbox",
    });

    const isDisabled = 
    !plaid.ready

    const onClick = () => {
        plaid.open();
    }
    return (
        <Button 
            onClick={onClick}
            size={"sm"}
            variant={"ghost"}
            disabled={isDisabled}
        >
            Connect
        </Button>
    )
};
