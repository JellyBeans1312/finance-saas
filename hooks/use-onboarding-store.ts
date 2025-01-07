import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingStore {
    hasSeenOnboarding: boolean;
    setHasSeenOnboarding: (hasSeenOnboarding: boolean) => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
    persist((set) => ({
        hasSeenOnboarding: false,
        setHasSeenOnboarding: (hasSeenOnboarding) => set({ hasSeenOnboarding }),
    }), { 
            name: 'onboarding-store' 
        }
    )
);