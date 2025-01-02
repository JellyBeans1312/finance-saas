import { create } from "zustand";
import { AppFeatures } from '@/db/schema';

interface SubscriptionModalStore {
    isOpen: boolean;
    feature: AppFeatures | null;
    onOpen: (feature: AppFeatures) => void;
    onClose: () => void;
}

export const useSubscriptionModal = create<SubscriptionModalStore>((set) => ({
    isOpen: false,
    feature: null,
    onOpen: (feature) => set({ isOpen: true, feature }),
    onClose: () => set({ isOpen: false, feature: null }),
}));