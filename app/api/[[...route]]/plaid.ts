import { Hono } from 'hono';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { plaidClient } from '@/lib/plaid';
import { CountryCode, PlaidEnvironments, Products } from 'plaid';

import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/db/drizzle';
import { and, eq, isNotNull } from 'drizzle-orm';
import { accounts, connectedBanks, transactions, categories } from '@/db/schema';

import { createId } from '@paralleldrive/cuid2';
import { convertAmountToMiliunits } from '@/lib/utils';


const app = new Hono()
.get(
  "/connected-bank",
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);

    if(!auth?.userId) {
      return c.json({ error: "Unauthorized"}, 400);
    };
    
    const [connectedBank] = await db
    .select() 
    .from(connectedBanks)
    .where(
      eq(
        connectedBanks.userId,
        auth.userId
      )
    );

    return c.json({ data: connectedBank || null });
  }
)
.delete(
  "/connected-bank",
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);

    if(!auth?.userId) {
      return c.json({ error: "Unauthorized"}, 400);
    };
    
    const [connectedBank] = await db
    .delete(connectedBanks) 
    .where(
      eq(
        connectedBanks.userId,
        auth.userId
      )
    ).returning({
      id: connectedBanks.id
    });
    if(!connectedBank) {
      return c.json({ error: "Not Found"}, 404)
    }
    await db
    .delete(accounts)
    .where(
      and(
        eq(accounts.userId, auth.userId),
        isNotNull(accounts.plaidId),
      ),
    );

    await db
    .delete(categories)
    .where(
      and(
        eq(categories.userId, auth.userId),
        isNotNull(categories.plaidId),
      ),
    )
    return c.json({ data: connectedBank });
  }
)
.post(
  "/create-link-token",
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);

    if(!auth?.userId) {
      return c.json({ error: "Unauthorized"}, 400);
    };

    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: auth.userId || '' },
      client_name: "FinSync",
      language: 'en',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
      //TODO: enable_multi_item_link: true, NEED SESSION_FINISHED WEBHOOK
    });

    return c.json({ 
      data: tokenResponse.data.link_token
    }, 200);
  }
)
.post(
  "/exchange-public-token",
  clerkMiddleware(),
  zValidator(
    "json",
    z.object({
      publicToken: z.string()
    })
  ),
  async (c) => {
    const auth = getAuth(c);

    const { publicToken } = c.req.valid('json');

    if(!auth?.userId) {
      return c.json({ error: "Unauthorized"}, 400);
    };

    const accessToken = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const [ connectedBank ] = await db
    .insert(connectedBanks)
    .values({
      userId: auth.userId,
      accessToken: accessToken.data.access_token,
      id: createId(),
    })
    .returning();

    // TODO: insitutions.get

    const plaidTransactions = await plaidClient.transactionsSync({
      access_token: connectedBank.accessToken,
    });
    console.log(plaidTransactions.data);
    const plaidAccounts = await plaidClient.accountsGet({
      access_token: connectedBank.accessToken
    });

    const plaidCategories = await plaidClient.categoriesGet({});

    const newAccounts = await db
    .insert(accounts)
    .values(
      plaidAccounts.data.accounts.map((account) => ({
        id: createId(),
        name: account.name,
        plaidId: account.account_id,
        userId: auth.userId
        })
      )
    )
    .returning();

    const newCategories = await db
    .insert(categories)
    .values(
      plaidCategories.data.categories.map((category) => ({
        id: createId(),
        name: category.hierarchy.join(', '),
        plaidId: category.category_id,
        userId: auth.userId
        })
      )
    )
    .returning();

    const newTransactionValues = plaidTransactions.data.added
      .reduce((acc, transaction) => {
        const account = newAccounts.find((account) => account.plaidId === transaction.account_id)
        const category = newCategories.find((category) => category.plaidId === transaction.category_id)
        const amountInMiliunits = convertAmountToMiliunits(transaction.amount);

        if(account) {
          acc.push({
            id: createId(),
            amount: amountInMiliunits,
            payee: transaction.merchant_name || transaction.name,
            notes: transaction.name,
            date: new Date(transaction.date),
            accountId: account.id,
            categoryId: category?.id,
          })
        };

        return acc;
      }, [] as typeof transactions.$inferInsert[]);

      if(newTransactionValues.length > 0 ) {
        await db
        .insert(transactions)
        .values(newTransactionValues)
      };

    return c.json({ ok: true }, 200);
  }
)

export default app