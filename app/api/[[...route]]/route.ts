import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';

import accounts from './routes/banking/accounts';
import categories from './routes/banking/categories';
import transactions from './routes/banking/transactions';
import summary from './routes/summary';
import plaid from './routes/plaid';
import subscriptions from './routes/subscriptions';  
import invoices from './routes/sales/invoices';
import plaidWebhook from './routes/webhooks/plaid';
import lemonsqueezyWebhook from './routes/webhooks/subscriptions';
import { db } from '@/db/drizzle';
import { subscriptions as subscriptionsTable } from '@/db/schema';


export const runtime = 'nodejs'


const app = new Hono().basePath('/api')

app.use('/api/*',
  cors({
    origin: [
        process.env.NEXT_PUBLIC_APP_URL!,
        'https://www.coreledger.app',
        'https://app.lemonsqueezy.com',
        'https://clerk.com',
        'https://clerk.dev',
        'https://clerk.coreledger.app',
        'https://accounts.coreledger.app',
        'https://*.clerk.accounts.dev',
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: [
        'Content-Type',
        'Authorization',
        'X-CSRF-Token',
        'X-Requested-With',
        'Accept',
        'Accept-Version',
        'Content-Length',
        'Content-MD5',
        'Content-Type',
        'Date',
        'X-Api-Version',
        'Clerk-Frontend-Api',
    ],
    exposeHeaders: ['Content-Length', 'X-Requested-With'],
    maxAge: 86400,
    credentials: true,
  })
);

app.use('*', 
    async (c, next) => {
        try {
            await next()
        } catch (error) {
            console.error(error, {
                path: c.req.url,
                error: error instanceof Error ? error.message : error
            });
            return c.json({
                error: 'Internal Server Error',
                details: process.env.NODE_ENV === 'production' ? undefined : error
            }, 500)
        }
    }
);

app.get('/api/debug/env', async (c) => {
  return c.json({
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    nodeEnv: process.env.NODE_ENV,
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY ? 'set' : 'not set',
    clerkSecretKey: process.env.CLERK_SECRET_KEY ? 'set' : 'not set',
  })
});

app.get('/api/debug/db', async (c) => {
    try {
      // Simple query to test DB connection
      const result = await db.select().from(subscriptionsTable).limit(1)
      return c.json({ success: true, result })
    } catch (error) {
      console.error('DB Error:', error)
      return c.json({ 
        error: 'Database Error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 500)
    }
  });

const routes = app
    .route("/accounts", accounts)
    .route('/categories', categories)
    .route('/transactions', transactions)
    .route('/summary', summary)
    .route('/plaid', plaid)
    .route('/subscriptions', subscriptions)
    .route('/invoices', invoices)
    .route('/webhooks/plaid', plaidWebhook)
    .route('/webhooks/subscriptions', lemonsqueezyWebhook)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;

