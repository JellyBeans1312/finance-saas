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
import { 
    useGetDashboardSales,
    useGetDashboardBanking,
    useGetDashboardAccounts,
} from '@/features/summary/api/use-get-summary';
import { DashboardSkeleton } from './dashboard-skeleton';

export const DashboardView = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
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
                    {/* <QuickActions /> */}
                    <div className="space-y-6">
                        <Suspense fallback={<OverviewStats.Skeleton />}>
                            <OverviewStatsWrapper />
                        </Suspense>
                        
                        <div className={`grid gap-6 ${isMobile ? '' : 'md:grid-cols-2'} w-full`}>
                            <Suspense fallback={<AccountBalances.Skeleton />}>
                                <AccountBalancesWrapper />
                            </Suspense>
                            
                            <Suspense fallback={<RecentTransactions.Skeleton />}>
                                <RecentTransactionsWrapper />
                            </Suspense>
                        </div>
                        
                        <div className={`grid gap-6 ${isMobile ? '' : 'md:grid-cols-2'} w-full`}>
                            {/* <ExpensesOverview /> */}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

const OverviewStatsWrapper = () => {
    const { data: salesOverview } = useGetDashboardSales();
    const { data: bankingOverview } = useGetDashboardBanking();
    
    if(!salesOverview || !bankingOverview) return <OverviewStats.Skeleton />
    return (
        <OverviewStats 
            bankingOverview={bankingOverview?.banking} 
            salesOverview={salesOverview}
        />
    );
};

const AccountBalancesWrapper = () => {
    const { data: accountsOverview } = useGetDashboardAccounts();
    return <AccountBalances accounts={accountsOverview?.accounts} />;
};

const RecentTransactionsWrapper = () => {
    const { data: accountsOverview } = useGetDashboardAccounts();
    return <RecentTransactions recentTransactions={accountsOverview?.recentTransactions} />;
};