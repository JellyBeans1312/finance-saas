import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

import { useCheckoutSubscription } from "@/features/subscriptions/api/use-checkout-subscription";
import { useSubscriptionModal } from "@/features/subscriptions/hooks/use-subscription-modal";

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
    const { isOpen, onClose } = useSubscriptionModal();

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
                        Upgrade to a paid plan.
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Upgrade to a paid plan to unlock more features
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <ul className='space-y-2'>
                    <li className='flex items-center'>
                        <CheckCircle2
                            className='size-5 m402 fill-blue-500 text-white'
                        />
                        <p className='text-sm text-muted-foreground'>
                            Upload CSV Files
                        </p>
                    </li>
                    <li className='flex items-center'>
                        <CheckCircle2
                            className='size-5 m402 fill-blue-500 text-white'
                        />
                        <p className='text-sm text-muted-foreground'>
                            Log your Payroll (Coming Soon)
                        </p>
                    </li>
                    <li className='flex items-center'>
                        <CheckCircle2
                            className='size-5 m402 fill-blue-500 text-white'
                        />
                        <p className='text-sm text-muted-foreground'>
                            Create Invoices (Coming Soon)
                        </p>
                    </li>
                    <li className='flex items-center'>
                        <CheckCircle2
                            className='size-5 m402 fill-blue-500 text-white'
                        />
                        <p className='text-sm text-muted-foreground'>
                            File your taxes (Coming Soon)
                        </p>
                    </li>
                </ul>
                <DialogFooter className='pt-2 mt-4 gap-y-2'>
                    <Button 
                        className='w-full'
                        onClick={() => checkout.mutate()}
                        disabled={checkout.isPending}
                    >
                        Upgrade
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}