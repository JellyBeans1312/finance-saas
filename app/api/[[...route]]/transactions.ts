import { Hono } from 'hono';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { 
    and, 
    desc, 
    eq, 
    gte, 
    inArray, 
    lte, 
    sql,
} from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { subDays, parse } from 'date-fns'

import { db } from '@/db/drizzle';
import { 
    transactions,
    insertTransactionSchema,
    categories,
    accounts
 } from '@/db/schema';

const app = new Hono()

 .get(
    "/",
    zValidator("query", z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional()
    })),
    clerkMiddleware(),
    async (c) => {
        const auth = getAuth(c);
        const { from, to, accountId } = c.req.valid("query");

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401) 
        };

        const defaultFrom = subDays(new Date(), 30);
        const defaultTo = new Date();

        const startDate = from ? 
         parse(from, 'yyyy-MM-DD', new Date())
         : defaultFrom;

        const endDate = to ?
        parse(to, 'yyyy-MM-DD', new Date())
        : defaultTo;

        const data = await db
            .select({
                id: transactions.id,
                amount: transactions.amount,
                payee: transactions.payee,
                notes: transactions.notes,
                date: transactions.date,
                accountId: accounts.id,
                account: accounts.name,
                categoryId: categories.id,
                category: categories.name,
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .leftJoin(categories, eq(categories.id, transactions.categoryId))
            .where(
                and(
                    accountId ? eq(transactions.accountId, accountId) : undefined,
                    eq(accounts.userId, auth.userId),
                    gte(transactions.date, startDate),
                    lte(transactions.date, endDate),
                )
            )
            .orderBy(desc(transactions.date));
            
            return c.json({ data })
  })
  .get(
    "/:id",
    zValidator("param", z.object({
        id: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if(!id) {
            return c.json({ error: "Missing id" }, 400);
        };

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        };
        
        const [ data ] = await db
        .select({
            id: transactions.id,
            amount: transactions.amount,
            payee: transactions.payee,
            notes: transactions.notes,
            date: transactions.date,
            accountId: accounts.id,
            categoryId: categories.id,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
            and(
                eq(accounts.userId, auth.userId),
                eq(transactions.id, id),
            ),
        );

        if(!data) {
            return c.json({ error: "Not Found" }, 404);
        };

        return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema.omit({
        id: true,
    })),
    async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if(!auth?.userId) {
            return c.json({ error: "unauthorized"}, 401)
        }

        const [ data ] = await db.insert(transactions).values({
            id: createId(),
            ...values,
        }).returning();
        
        return c.json({ data });

    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
        "json",
        z.object({
            ids: z.array(z.string()),
        }),
    ),
    async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401);
        }
        
        const transactionsToDelete = db.$with("transactions_to_delete").as(
            db.select({ id: transactions.id })
            .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        inArray(transactions.id, values.ids)
                    ),
                ),
            );

        const data = await db
            .with(transactionsToDelete)
            .delete(transactions)
            .where(
                inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
            )
            
            return c.json({ data })
        }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
        "param",
        z.object({ id: z.string().optional() })
    ),
    zValidator(
        "json",
        insertTransactionSchema.omit({
            id: true
        })
    ),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");
        const values = c.req.valid("json");

        if (!id) {
            return c.json({ error: "Missing Id"}, 400);
        };

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401)
        };

        const transactionsToUpdate = db.$with("transactions_to_update").as(
            db.select({ id: transactions.id })
            .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(transactions.id, id)
                    ),
                ),
            );

        const [ data ] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
            inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`),
        ).returning();

        if(!data) {
            return c.json({ error: "Not Found"}, 404);
        };

        return c.json({ data })
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
        "param",
        z.object({ id: z.string().optional() })
    ),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if (!id) {
            return c.json({ error: "Missing Id"}, 400);
        };

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401)
        };

        const transactionToDelete = db.$with("transaction_to_delete").as(
            db.select({ id: transactions.id })
            .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(transactions.id, id)
                    ),
                ),
            );

        const [ data ] = await db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
            inArray(transactions.id, sql`(select id from ${transactionToDelete})`)
        ).returning({
            id: transactions.id,
        });
        
        
        if(!data) {
            return c.json({ error: "Not Found"}, 404);
        };

        return c.json({ data })
    }
  )

export default app;