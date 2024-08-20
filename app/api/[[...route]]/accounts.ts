import { Hono } from 'hono';
import { db } from '@/db/drizzle';
import { accounts, insertAccountSchema } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';

const app = new Hono()
 .get(
    "/",
    clerkMiddleware(),
    async (c) => {
        const auth = getAuth(c);

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401) 
        }

        const data = await db
            .select({
                id: accounts.id,
                name: accounts.name
            })
            .from(accounts)
            .where(eq(accounts.userId, auth.userId));

        return c.json({ data })
  })
  .post(
    "/",
    zValidator("json", insertAccountSchema.pick({
        name: true
    })),
    clerkMiddleware(),
    async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if(!auth?.userId) {
            return c.json({ error: "unauthorized"}, 401)
        }

        const [ data ] = await db.insert(accounts).values({
            id: createId(),
            userId: auth.userId,
            ...values,
        }).returning();
        
        return c.json({ data });

    }
  );

export default app;