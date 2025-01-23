import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';


import { client } from '@/lib/hono';
import { convertAmountFromMiliunits } from '@/lib/utils';

export const useGetDashboardBanking = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    return useQuery({
        queryKey: ['summary', { from, to }],
        queryFn: async () => {
            const response = await client.api.summary['dashboard-banking'].$get({
                query: { from, to }
            });

            if(!response.ok) {
                throw new Error("Failed to fetch summary")
            }

            const { data } = await response.json();
            return {
                banking: {
                    totalIncome: convertAmountFromMiliunits(data.totalIncome),
                    totalExpenses: convertAmountFromMiliunits(data.totalExpenses),
                }
            };
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetDashboardSales = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    return useQuery({
        queryKey: ['dashboard-sales', { from, to }],
        queryFn: async () => {
            const response = await client.api.summary['dashboard-sales'].$get({
                query: { from, to }
            });

            if(!response.ok) {
                throw new Error("Failed to fetch summary")
            }

            const { data } = await response.json();
            return data;
        },
        staleTime: 1000 * 60 * 5,
    });
}

export const useGetDashboardAccounts = () => {
    return useQuery({
        queryKey: ['dashboard-accounts'],
        queryFn: async () => {
            const response = await client.api.summary['dashboard-accounts'].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch accounts overview");
            }

            const { data } = await response.json();
            
            return {
                accounts: data.accounts.map((account) => ({
                    ...account,
                    balance: convertAmountFromMiliunits(account.balance),
                })),
                recentTransactions: data.recentTransactions.map((transaction) => ({
                    ...transaction,
                    amount: convertAmountFromMiliunits(transaction.amount),
                })),
            };
        },
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60
    });
};

export const useGetBankingSummary = () => {
    const params = useSearchParams();
    const from = params.get("from") || "" ;
    const to = params.get("to") || "" ;
    const accountId = params.get("accountId") || "" ;


    const query = useQuery({
        queryKey: ['banking-summary', { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.summary['banking-summary'].$get({
                query: {
                    from,
                    to,
                    accountId,
                }
            });

            if(!response.ok) {
                throw new Error("Failed to fetch summary")
            }

            const { data } = await response.json();
            return {
                ...data,
                incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
                expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
                remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
                categories: data.categories.map((category) => ({
                    ...category,
                    value: convertAmountFromMiliunits(category.value)
                })),
                days: data.days.map((day) => ({
                    ...day,
                    income: convertAmountFromMiliunits(day.income),
                    expenses: convertAmountFromMiliunits(day.expenses),
                })),
            }
        }
    })
    return query;
}

export const useGetSalesSummary = () => {
    const params = useSearchParams();
    const from = params.get("from") || "" ;
    const to = params.get("to") || "" ;
    const accountId = params.get("accountId") || "" ;


    const query = useQuery({
        queryKey: ['sales-summary', { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.summary['sales-summary'].$get({
                query: {
                    from,
                    to,
                }
            });

            if(!response.ok) {
                throw new Error("Failed to fetch summary")
            }

            // const { data } = await response.json();
            // return data;
        },
        staleTime: 1000 * 60 * 5,
    })
    return query;
}