import { AppFeatures } from '@/db/schema';
import { Landmark, Receipt } from 'lucide-react';

export const FEATURE_DETAILS = {
    [AppFeatures.BANKING]: {
        title: 'Banking Features',
        description: 'Connect your bank accounts and track transactions',
        icon: Landmark,
        price: '$9/month',
        features: [
            'Connect unlimited bank accounts',
            'Real-time transaction tracking',
            'CSV import/export',
            'Transaction categorization'
        ]
    },
    [AppFeatures.SALES]: {
        title: 'Sales Features',
        description: 'Create and manage invoices',
        icon: Receipt,
        price: '$12/month',
        features: [
            'Unlimited invoices',
            'Custom invoice templates',
            'Payment tracking',
            'Client management'
        ]
    }
} as const;