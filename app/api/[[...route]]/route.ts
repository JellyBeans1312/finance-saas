import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import accounts from './routes/banking/accounts';
import categories from './routes/banking/categories';
import transactions from './routes/banking/transactions';
import summary from './routes/summary';
import plaid from './routes/plaid';
import subscriptions from './routes/subscriptions';  
import invoices from './routes/sales/invoices';

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

const routes = app
    .route("/accounts", accounts)
    .route('/categories', categories)
    .route('/transactions', transactions)
    .route('/summary', summary)
    .route('/plaid', plaid)
    .route('/subscriptions', subscriptions)
    .route('/invoices', invoices)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;

