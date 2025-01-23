import { db } from "@/db/drizzle";
import { transactions, accounts, categories, invoices} from "@/db/schema";
import { sql, sum, eq, and, gte, lte, lt, desc, count } from "drizzle-orm";

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getAuth } from "@hono/clerk-auth";

import { z } from 'zod';
import { subDays, parse, differenceInDays } from "date-fns";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

import { clerkConfig } from "@/lib/clerk";
import { InvoiceStatus } from "@/features/invoices/types";

// TODO: breakdown banking summary
// TODO: breakdown sales summary

const getDateRange = (from?: string, to?: string) => {
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from 
        ? parse(from, 'yyyy-MM-dd', new Date())
        : defaultFrom;

    const endDate = to 
        ? parse(to, 'yyyy-MM-dd', new Date())
        : defaultTo;

    return { startDate, endDate };
};

async function getAccountsOverview(userId: string) {
    const accountBalances = await db
        .select({
            accountId: accounts.id,
            accountName: accounts.name,
            balance: sql`SUM(${transactions.amount})`.mapWith(Number),
            lastUpdated: sql`MAX(${transactions.date})`.mapWith(Date),
        })
        .from(accounts)
        .leftJoin(
            transactions,
            eq(accounts.id, transactions.accountId)
        )
        .where(
            eq(accounts.userId, userId)
        )
        .groupBy(accounts.id, accounts.name);

        const recentTransactions = await db
        .select({
            id: transactions.id,
            date: transactions.date,
            amount: transactions.amount,
            accountId: transactions.accountId,
            accountName: accounts.name,
            categoryName: categories.name,
            payee: transactions.payee,
        })
        .from(transactions)
        .innerJoin(
            accounts,
            eq(transactions.accountId, accounts.id)
        )
        .leftJoin(
            categories,
            eq(transactions.categoryId, categories.id)
        )
        .where(
            eq(accounts.userId, userId)
        )
        .orderBy(desc(transactions.date))
        .limit(5);

    return {
        accounts: accountBalances,
        recentTransactions,
    };
}

const app = new Hono()
    .get(
        '/dashboard-banking',
        clerkConfig,
        zValidator(
            "query",
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { from, to } = c.req.valid("query");
            
            if(!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401);
            }

            const { startDate, endDate } = getDateRange(from, to);

            const [bankingSummary] = await db
                .select({
                    totalIncome: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                    totalExpenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate),
                    )
                );

            return c.json({
                data: {
                    totalIncome: bankingSummary.totalIncome || 0,
                    totalExpenses: bankingSummary.totalExpenses || 0,
                }
            });
        }
    )
    .get(
        '/dashboard-sales',
        clerkConfig,
        zValidator(
            "query",
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
            })
        ),
        async (c) => {
            //TODO: scope out other data to summarize.
            const auth = getAuth(c);
            const { from, to } = c.req.valid("query");

            if(!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401);
            }

            const { startDate, endDate } = getDateRange(from, to);

            const [salesSummary] = await db
                .select({
                    totalInvoices: count(),
                    totalAmount: sum(invoices.total).mapWith(Number),
                    paidAmount: sql`SUM(CASE WHEN ${invoices.status} = 'PAID' THEN ${invoices.total} ELSE 0 END)`.mapWith(Number),
                    overdueAmount: sql`SUM(CASE WHEN ${invoices.status} = 'OVERDUE' THEN ${invoices.total} ELSE 0 END)`.mapWith(Number),
                })
                .from(invoices)
                .where(
                    and(
                        eq(invoices.userId, auth.userId),
                        gte(invoices.issueDate, startDate),
                        lte(invoices.issueDate, endDate),
                    )
                );

            return c.json({
                data: {
                    totalInvoices: salesSummary.totalInvoices || 0,
                    totalAmount: salesSummary.totalAmount || 0,
                    paidAmount: salesSummary.paidAmount || 0,
                    overdueAmount: salesSummary.overdueAmount || 0,
                }
            });
        }
    )
    .get(
        '/dashboard-accounts',
        clerkConfig,
        async (c) => {
            const auth = getAuth(c);
            if(!auth?.userId) return c.json({ error: "Unauthorized"}, 401);

            const data = await getAccountsOverview(auth.userId);
            return c.json({ data });
        }
    )
    .get(
        "/banking-summary",
        clerkConfig,
        zValidator(
            "query",
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional()
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { from, to, accountId } = c.req.valid("query");

            if(!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            };

            const { startDate, endDate } = getDateRange(from, to);

            const periodLength = differenceInDays(endDate, startDate) + 1;

            const previousPeriodStart = subDays(startDate, periodLength);
            const previousPeriodEnd = subDays(endDate, periodLength);


            async function getFinancialData(
                userId: string,
                startDate: Date,
                endDate: Date
            ) {
                return await db
                    .select({
                        income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                        expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                        remaining: sum(transactions.amount).mapWith(Number),
                    })
                    .from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            accountId ? eq(transactions.accountId, accountId) : undefined,
                            eq(accounts.userId, userId),
                            gte(transactions.date, startDate),
                            lte(transactions.date, endDate),
                        )
                    );
            };

            const [currentPeriod] = await getFinancialData(
                auth.userId,
                startDate,
                endDate
            );
            const [previousPeriod] = await getFinancialData(
                auth.userId,
                previousPeriodStart,
                previousPeriodEnd
            );


            const incomeChange = calculatePercentageChange(
                currentPeriod.income,
                previousPeriod.income,
            );
            const expensesChange = calculatePercentageChange(
                currentPeriod.expenses,
                previousPeriod.expenses,
            );
            const remainingChange = calculatePercentageChange(
                currentPeriod.remaining,
                previousPeriod.remaining,
            );

            const category = await db
                .select({
                    name: categories.name,
                    value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number)
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .innerJoin(categories, eq(transactions.categoryId, categories.id))
                .where(
                    and(
                        accountId ? eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, auth.userId),
                        lt(transactions.amount, 0),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate),
                    )
                )
                .groupBy(categories.name)
                .orderBy(desc(
                    sql`SUM(ABS(${transactions.amount}))`
                ));

            const topCategories = category.slice(0, 3);
            const otherCategories = category.slice(3);
            const otherSum = otherCategories
            .reduce((sum, current ) => sum + current.value, 0);

            const finalCategories = topCategories;

            if(otherCategories.length > 0) {
                finalCategories.push({ 
                    name: "Other",
                    value: otherSum
                })
            }

            const activeDays = await db
                .select({
                    date: transactions.date,
                    income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                    expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(Number),
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        accountId ? eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, auth.userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate),
                    )
                )
                .groupBy(transactions.date)
                .orderBy(transactions.date)

            const days = fillMissingDays(activeDays, startDate, endDate);

            return c.json({
                data: {
                    incomeAmount: currentPeriod.income,
                    incomeChange, 
                    expensesAmount: currentPeriod.expenses,
                    expensesChange,
                    remainingAmount: currentPeriod.remaining,
                    remainingChange,
                    categories: finalCategories,
                    days
                }
            });
        },
    )
    .get(
        '/sales-summary',
        clerkConfig,
        zValidator(
            "query",
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { from, to } = c.req.valid("query");

            if(!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            };

            const { startDate, endDate } = getDateRange(from, to);

            async function getInvoiceSummary(
                userId: string,
                startDate: Date,
                endDate: Date
            ) {
                const [totalInvoices] = await db.select({
                    total: count(),
                    amount: sum(invoices.total),
                })
                .from(invoices)
                .where(
                    and(
                        eq(invoices.userId, userId),
                        gte(invoices.issueDate, startDate),
                        lte(invoices.issueDate, endDate),
                    )
                );

                const [paidInvoices] = await db.select({
                    total: sql`SUM(CASE WHEN ${invoices.status} = 'PAID' THEN 1 ELSE 0 END)`.mapWith(Number),
                    amount: sql`SUM(CASE WHEN ${invoices.status} = 'PAID' THEN ${invoices.total} ELSE 0 END)`.mapWith(Number),
                })
                .from(invoices)
                .where(
                    and(
                        eq(invoices.userId, userId),
                        eq(invoices.status, InvoiceStatus.PAID),
                        gte(invoices.issueDate, startDate),
                        lte(invoices.issueDate, endDate),
                    )
                );

                const [overdueInvoices] = await db.select({
                    total: sql`SUM(CASE WHEN ${invoices.status} = 'OVERDUE' THEN 1 ELSE 0 END)`.mapWith(Number),
                    amount: sql`SUM(CASE WHEN ${invoices.status} = 'OVERDUE' THEN ${invoices.total} ELSE 0 END)`.mapWith(Number),
                })
                .from(invoices)
                .where(
                    and(
                        eq(invoices.userId, userId),
                        eq(invoices.status, InvoiceStatus.OVERDUE),
                        gte(invoices.issueDate, startDate),
                        lte(invoices.issueDate, endDate),
                    )
                );

                

                return {
                    totalInvoices,
                    totalAmount: totalInvoices.amount,
                    paidInvoices,
                    paidAmount: paidInvoices.amount,
                    overdueInvoices,
                    overdueAmount: overdueInvoices.amount,
                };
            }

            const data = await getInvoiceSummary(auth.userId, startDate, endDate);
            return c.json({ data }, 200);
            // TODO: add expenses, customers, and customer payments 
        }
    )

export default app;