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
import { clerkMiddleware } from '@hono/clerk-auth';


export const runtime = 'nodejs'


const app = new Hono().basePath('/api')

app.get('/debug/clerk', async (c) => {
    return c.json({
      environment: process.env.NODE_ENV,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      publishableKeyLength: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.length || 0,
      hasSecretKey: !!process.env.CLERK_SECRET_KEY,
      secretKeyLength: process.env.CLERK_SECRET_KEY?.length || 0,
      // Don't include the actual keys in production!
      keys: process.env.NODE_ENV === 'development' ? {
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        secretKey: '[REDACTED]'
      } : undefined
    });
  });

app.use('*', async (c, next) => {
    console.log('Environment Check:', {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'set' : 'not set',
      secretKey: process.env.CLERK_SECRET_KEY ? 'set' : 'not set',
      env: process.env.NODE_ENV,
    });
    await next();
  });

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

app.use('*', clerkMiddleware({
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  }));
  

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

