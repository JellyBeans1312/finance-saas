import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { AppFeatures } from '@/db/schema';
import { useCheckoutSubscription } from "@/features/subscriptions/api/use-checkout-subscription";
import { useSubscriptionModal } from "@/features/subscriptions/hooks/use-subscription-modal";
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { useCancelSubscription } from '@/features/subscriptions/api/use-cancel-subscription';
import { useConfirm } from '@/hooks/use-confirm';
import { useGetSubscription } from '@/features/subscriptions/api/use-get-subscription';
import { FEATURE_DETAILS } from '../subscription-constants';
import { SubscriptionStatus } from './subscription-status';
import { FeatureList } from './feature-list';
import { Subscription } from '../types';

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

export const SubscriptionModal = () => {
    const checkout = useCheckoutSubscription();
    const { isOpen, onClose, feature } = useSubscriptionModal();
    const { hasFeature } = useFeatureAccess();
    const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription();
    const { data: currentSubscription } = useGetSubscription();
    
    const [ConfirmDialog, confirm] = useConfirm(
        "Cancel Subscription",
        "Are you sure you want to cancel your subscription? You will lose access to the subscribed features at the end of your billing period."
    );

    const handleCancelSubscription = async () => {
        const ok = await confirm();
        if (ok) {
            cancelSubscription();
            onClose();
        }
    };

    if (!feature) return null;
    
    const isAlreadySubscribed = hasFeature(feature);

    const details = FEATURE_DETAILS[feature!];

    return (
        <>
            <ConfirmDialog />
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
                            {hasFeature(feature) 
                                ? "Manage your subscription"
                                : `Unlock ${feature} features for ${details.price}`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    {hasFeature(feature!) ? (
                        <div className='space-y-4'>
                            <div className='bg-muted/50 p-4 rounded-lg'>
                                <SubscriptionStatus subscription={currentSubscription as Subscription | null} />
                            </div>
                            {currentSubscription?.status === 'active' && (
                                <Button
                                    variant="destructive"
                                    onClick={handleCancelSubscription}
                                    disabled={isCancelling}
                                    className="w-full"
                                >
                                    {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <FeatureList 
                                features={Array.from(details.features)} 
                                variant="check" 
                            />
                            <DialogFooter className='pt-2 mt-4'>
                                <Button 
                                    className='w-full'
                                    onClick={() => checkout.mutate({ feature: feature! })}
                                    disabled={checkout.isPending || isAlreadySubscribed}
                                >
                                    Upgrade Now
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};