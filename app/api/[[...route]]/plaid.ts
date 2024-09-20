import { Hono } from 'hono';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { config } from 'dotenv';

import { plaidClient } from '@/lib/plaid';
import { CountryCode, PlaidEnvironments, Products } from 'plaid';

import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/db/drizzle';
import { connectedBanks } from '@/db/schema';

import { createId } from '@paralleldrive/cuid2';


const app = new Hono()
// .get(
//   "/api/",
//   clerkMiddleware(),
//   async (c) => {
//     const auth = getAuth(c);

//     if(!auth?.userId) {
//       return c.json({ error: "Unauthorized"}, 400)
//     };
//     console.log(auth.userId)
//     const tokenResponse = await plaidClient.linkTokenCreate({
//       user: { client_user_id: auth.userId || '' },
//       client_name: "FinSync",
//       language: 'en',
//       products: [Products.Auth, Products.Transactions],
//       country_codes: [CountryCode.Us],
//       redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
//     });

//     return c.json(tokenResponse.data);
//   }
// )
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

    
    return c.json({ 
      data: accessToken.data.access_token
    }, 200);
  }
)

export default app