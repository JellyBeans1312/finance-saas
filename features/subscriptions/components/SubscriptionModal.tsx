import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { AppFeatures } from '@/db/schema';
import { useCheckoutSubscription } from "@/features/subscriptions/api/use-checkout-subscription";
import { useSubscriptionModal } from "@/features/subscriptions/hooks/use-subscription-modal";
import { useFeatureAccess } from '@/hooks/use-feature-access';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const FEATURE_DETAILS = {
  [AppFeatures.BANKING]: {
    title: 'Banking Features',
    features: [
      'Connect Bank Accounts',
      'Track Transactions',
      'Upload CSV Files',
      'Log your Payroll (Coming Soon)',
    ],
    price: '$9/month'
  },
  [AppFeatures.SALES]: {
    title: 'Sales Features',
    features: [
      'Create Invoices',
      'Track Payments',
      'Client Management',
      'File your taxes (Coming Soon)',
    ],
    price: '$12/month'
  }
};

export const SubscriptionModal = () => {
    const checkout = useCheckoutSubscription();
    const { isOpen, onClose, feature } = useSubscriptionModal();
    const { hasFeature } = useFeatureAccess();

    if (!feature) return null;

    const details = FEATURE_DETAILS[feature];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className='flex items-center space-y-4'>
                    <Image 
                        src={"/logo-dark.svg"}
                        alt='logo'
                        width={36}
                        height={36}
                    />
                    <DialogTitle className='text-center'>
                        {details.title}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Unlock {feature} features for {details.price}
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <ul className='space-y-2'>
                    {details.features.map((featureText, index) => (
                        <li key={index} className='flex items-center'>
                            <CheckCircle2
                                className='size-5 m402 fill-blue-500 text-white'
                            />
                            <p className='text-sm text-muted-foreground'>
                                {featureText}
                            </p>
                        </li>
                    ))}
                </ul>
                <DialogFooter className='pt-2 mt-4 gap-y-2'>
                    <Button 
                        className='w-full'
                        onClick={() => checkout.mutate({ feature })}
                        disabled={checkout.isPending || hasFeature(feature)}
                    >
                        {hasFeature(feature) ? 'Already Purchased' : 'Upgrade'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}