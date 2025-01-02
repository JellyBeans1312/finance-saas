'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import { Button } from '@/components/ui/button';

import { useCreateUpdateLinkToken } from '../api/use-create-update-link-token';

interface PlaidUpdateProps {
  bankId: string;
  onSuccess?: () => void;
  accountSelectionEnabled?: boolean;
}

export const PlaidUpdate = ({ 
  bankId, 
  onSuccess,
  accountSelectionEnabled = false
}: PlaidUpdateProps) => {
  const [token, setToken] = useState<string | null>(null);
  const createUpdateToken = useCreateUpdateLinkToken();

  const plaid = usePlaidLink({
    token,
    onSuccess: () => {
      onSuccess?.();
    },
    onExit: (err) => {
      if (err != null) {
        toast.error(err.error_message || 'An error occurred');
      }
    },
    accountSubtypes: accountSelectionEnabled ? {
        depository: ['checking', 'savings']
    } : undefined
  });

  const onClick = () => {
    createUpdateToken.mutate({ bankId }, {
      onSuccess: ({ data }) => {
        setToken(data);
        plaid.open();
      }
    });
  };

  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="ghost"
      disabled={createUpdateToken.isPending}
    >
      Update Connection
    </Button>
  );
}; 