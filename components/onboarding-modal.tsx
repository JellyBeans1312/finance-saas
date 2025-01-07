'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Landmark, Receipt, Sparkles } from 'lucide-react';
import { useOnboardingStore } from '../hooks/use-onboarding-store';

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

const ONBOARDING_STEPS = [
    {
        title: 'Welcome to CoreLedger',
        description: 'Your all-in-one financial management platform',
        icon: Sparkles,
        content: (
            <div className="space-y-4">
                <Image
                    src="/onboarding/welcome.png"
                    alt="Welcome"
                    width={400}
                    height={300}
                    className="rounded-lg"
                />
                <p className="text-muted-foreground text-sm">
                    Get started with managing your finances more effectively
                </p>
            </div>
        )
    },
    {
        title: 'Banking Features',
        description: 'Connect and manage your bank accounts',
        icon: Landmark,
        content: (
            <div className="space-y-4">
                <Image
                    src="/onboarding/banking.png"
                    alt="Banking Features"
                    width={400}
                    height={300}
                    className="rounded-lg"
                />
                <ul className="space-y-2">
                    <li className="text-sm text-muted-foreground flex items-center gap-x-2">
                        <ChevronRight className="size-4" />
                        Connect multiple bank accounts
                    </li>
                    <li className="text-sm text-muted-foreground flex items-center gap-x-2">
                        <ChevronRight className="size-4" />
                        Track transactions in real-time
                    </li>
                </ul>
            </div>
        )
    },
    {
        title: 'Sales Management',
        description: 'Create and manage invoices effortlessly',
        icon: Receipt,
        content: (
            <div className="space-y-4">
                <Image
                    src="/onboarding/sales.png"
                    alt="Sales Features"
                    width={400}
                    height={300}
                    className="rounded-lg"
                />
                <ul className="space-y-2">
                    <li className="text-sm text-muted-foreground flex items-center gap-x-2">
                        <ChevronRight className="size-4" />
                        Create professional invoices
                    </li>
                    <li className="text-sm text-muted-foreground flex items-center gap-x-2">
                        <ChevronRight className="size-4" />
                        Track payments automatically
                    </li>
                </ul>
            </div>
        )
    },
    {
        title: 'Special Offer',
        description: 'Get started with a discount',
        icon: Sparkles,
        content: (
            <div className="space-y-4 text-center">
                <Badge className="mx-auto text-lg px-4 py-2">
                    DEMOCORELEDGER654321
                </Badge>
                <p className="text-muted-foreground text-sm">
                    Thank you for choosing to demo CoreLedger! 
                    Use this code at checkout to get your first 3 months free!
                </p>
            </div>
        )
    }
];

export const OnboardingModal = () => {
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

    if (hasSeenOnboarding) {
        return null;
    }

    return (
        <Dialog open={!hasSeenOnboarding} onOpenChange={setHasSeenOnboarding}>
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
    );
};