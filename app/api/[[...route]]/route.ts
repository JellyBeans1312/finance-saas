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


export const runtime = 'nodejs'


const app = new Hono().basePath('/api')

app.use('/*', cors({
    origin: [
        'https://coreledger.app', 
        'http://localhost:3000', 
        'https://app.lemonsqueezy.com',
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Requested-With'],
    maxAge: 86400,
    credentials: true,
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

