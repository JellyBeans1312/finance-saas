'use client';

import { AppFeatures } from '@/db/schema';

import { useFeatureAccess } from '@/hooks/use-feature-access';

import { useGetConnectedBank } from '@/features/plaid/api/use-get-connected-bank';
import { PlaidConnect } from '@/features/plaid/components/plaid-connect';
import { PlaidDisconnect } from '@/features/plaid/components/plaid-disconnect';
import { PlaidUpdate } from '@/features/plaid/components/plaid-update';
import { SubscriptionCheckout } from '@/features/subscriptions/components/SubscriptionCheckout';

export const BankConnection = () => {
  const { data: bank, refetch } = useGetConnectedBank();
  const { hasFeature } = useFeatureAccess();

  if (!bank && hasFeature(AppFeatures.BANKING)) {
    return <PlaidConnect />;
  }

  if (!bank && !hasFeature(AppFeatures.BANKING)) {
    return (
      <SubscriptionCheckout 
        feature={AppFeatures.BANKING}
        bankConnection={true}
      />
    )
  }

  return (
    <div className="flex gap-2">
      {bank?.requiresUpdate ? (
        <PlaidUpdate 
          bankId={bank.id} 
          onSuccess={refetch}
        />
      ) : null}
      <PlaidDisconnect onSuccess={refetch} />
    </div>
  );
}; 