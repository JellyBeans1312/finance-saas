'use client';

import { useGetConnectedBank } from '../api/use-get-connected-bank';
import { PlaidConnect } from './plaid-connect';
import { PlaidDisconnect } from './plaid-disconnect';
import { PlaidUpdate } from './plaid-update';

export const BankConnection = () => {
  const { data: bank, refetch } = useGetConnectedBank();

  if (!bank) {
    return <PlaidConnect />;
  }

  return (
    <div className="flex gap-2">
      {bank.requiresUpdate ? (
        <PlaidUpdate 
          bankId={bank.id} 
          onSuccess={refetch}
        />
      ) : null}
      <PlaidDisconnect onSuccess={refetch} />
    </div>
  );
}; 