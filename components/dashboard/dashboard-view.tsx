'use client';

import { Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { OverviewStats } from '@/components/overview-stats'
import { AccountBalances } from '@/components/account-balances'
import { RecentTransactions } from '@/components/recent-transactions'
import { SalesOverview } from '@/components/sales-overview'
import { ExpensesOverview } from '@/components/expenses-overview'
import { QuickActions } from '@/components/quick-actions'
import { DashboardSkeleton } from './dashboard-skeleton';

export const DashboardView = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 w-full px-4 md:px-10 -mt-24"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <QuickActions />
                        <div className="space-y-6">
                            <OverviewStats />
                            <div className={`grid gap-6 ${isMobile ? '' : 'md:grid-cols-2'} w-full`}>
                                <AccountBalances />
                                <RecentTransactions />
                            </div>
                            <div className={`grid gap-6 ${isMobile ? '' : 'md:grid-cols-2'} w-full`}>
                                <ExpensesOverview />
                                {!isMobile && <SalesOverview />}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </Suspense>
    );
};