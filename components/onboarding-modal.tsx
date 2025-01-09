'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Landmark, Receipt, Sparkles, Copy, LineChart, FileText, WalletCards, MessageSquare } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useOnboardingStore } from '@/hooks/use-onboarding-store';

const ONBOARDING_STEPS = [
    {
        title: 'Welcome to CoreLedger',
        description: 'Your all-in-one financial management platform',
        icon: Sparkles,
        content: (
            <div className="space-y-4">
                <div className="p-6 rounded-lg bg-primary/10 text-center">
                    <Sparkles className="size-12 mx-auto mb-4 text-primary" />
                    <p className="text-lg font-medium">
                        Start Managing Your Finances Smarter
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                        Track, analyze, and optimize your financial activities in one place
                    </p>
                </div>
            </div>
        )
    },
    {
        title: 'Banking Features',
        description: 'Connect and manage your bank accounts',
        icon: Landmark,
        content: (
            <div className="space-y-4">
                <div className="grid gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Landmark className="size-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Account Management</h4>
                                <p className="text-sm text-muted-foreground">
                                    Connect and manage multiple bank accounts in one dashboard
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-primary/10">
                                <LineChart className="size-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Real-time Tracking</h4>
                                <p className="text-sm text-muted-foreground">
                                    Monitor transactions and balances as they happen
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: 'Sales Management',
        description: 'Create and manage invoices effortlessly',
        icon: Receipt,
        content: (
            <div className="space-y-4">
                <div className="grid gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-primary/10">
                                <FileText className="size-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Professional Invoicing</h4>
                                <p className="text-sm text-muted-foreground">
                                    Create and customize professional invoices in minutes
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-primary/10">
                                <WalletCards className="size-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Payment Tracking</h4>
                                <p className="text-sm text-muted-foreground">
                                    Automatically track and reconcile payments
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: 'Disclaimer',
        description: 'The app is currrently in demo mode. Please keep that in mind when using it.',
        icon: Receipt,
        content: (
            <div className="space-y-4">
                <div className="grid gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-primary/10">
                                <MessageSquare className="size-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Send us Feedback</h4>
                                <p className="text-sm text-muted-foreground">
                                    Contact us at <a href="mailto:support@coreledger.com" className="text-primary underline">support@coreledger.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Sparkles className="size-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Be on the lookout for new features</h4>
                                <p className="text-sm text-muted-foreground">
                                    We are constantly working on improving the app and adding new features
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: 'Special Offer',
        description: 'Get started with a discount',
        icon: Sparkles,
        content: (
            <div className="space-y-4 text-center">
                <div className="p-6 rounded-lg bg-primary/10">
                    <Badge 
                        className="mx-auto text-lg px-4 py-2 cursor-pointer hover:bg-primary/20" 
                        onClick={() => {
                            navigator.clipboard.writeText('DEMOCORELEDGER654321')
                            .then(() => toast.success('Code copied to clipboard'));
                        }}
                    >
                        <Copy className="size-4 mr-2" />
                        DEMOCORELEDGER654321
                    </Badge>
                    <p className="text-muted-foreground text-sm mt-4">
                        Click to copy your special discount code for 3 months free!
                    </p>
                </div>
            </div>
        )
    }
];

export const OnboardingModal = () => {
    const { user, isLoaded } = useUser();
    const [step, setStep] = useState(0);
    const { hasSeenOnboarding, setHasSeenOnboarding } = useOnboardingStore();
    const currentStep = ONBOARDING_STEPS[step];
    const isLastStep = step === ONBOARDING_STEPS.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            setHasSeenOnboarding(true);
        } else {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    if(!isLoaded || !user) {
        return null;
    }

    if (hasSeenOnboarding) {
        return null;
    }

    return (
        <Dialog open={true} onOpenChange={setHasSeenOnboarding}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto rounded-full bg-primary/10 p-3 w-fit">
                        <currentStep.icon className="size-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center">
                        {currentStep.title}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {currentStep.description}
                    </DialogDescription>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {currentStep.content}
                    </motion.div>
                </AnimatePresence>

                <DialogFooter className="flex-row justify-between space-x-2">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={step === 0}
                    >
                        <ChevronLeft className="size-4 mr-2" />
                        Previous
                    </Button>
                    <Button onClick={handleNext}>
                        {isLastStep ? 'Get Started' : 'Next'}
                        <ChevronRight className="size-4 ml-2" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};