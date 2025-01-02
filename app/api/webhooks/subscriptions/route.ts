import { Hono } from 'hono';
import crypto from 'crypto';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { subscriptions } from '@/db/schema';
import { createId } from '@paralleldrive/cuid2';
import { handle } from 'hono/vercel';

const lemonsqueezyWebhook = new Hono()
    .post(
        '/',
        async (c) => {
    const text = await c.req.text();

    const hmac = crypto.createHmac(
        "sha256",
        process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
    )

    const digest = Buffer.from(
        hmac.update(text).digest("hex"),
        "utf8"
    )

    const signature = Buffer.from(
        c.req.header("x-signature") as string,
        "utf8"
    );

    if(!crypto.timingSafeEqual(digest, signature)) {
        return c.json({ error: "Unauthorized"}, 401)
    }

    const payload = JSON.parse(text);
    const event = payload.meta.event_name;

    const subscriptionId = payload.data.id;
    const userId = payload.meta.custom_data.user_id;
    const status = payload.data.attributes.status;
    const feature = payload.meta.custom_data.feature;

    const [ existing ] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.subscriptionId, subscriptionId))

    if(event === "subscription_created") {
        if(existing) {
            await db
            .update(subscriptions)
            .set({
                status,
                features: [...existing.features, feature]
            })
            .where(
                eq(subscriptions.subscriptionId, subscriptionId)
            )
        } else {
            await db
            .insert(subscriptions)
            .values({
                id: createId(),
                subscriptionId,
                userId,
                status,
                features: [feature],
            })
        }
    }

    if(event === "subscription_updated") {
        if(existing) {
            await db
            .update(subscriptions)
            .set({
            status,
            features: [...existing.features, feature],
            })
            .where(
                eq(subscriptions.subscriptionId, subscriptionId)
            )
        } else {
            await db
            .insert(subscriptions)
            .values({
                id: createId(),
                subscriptionId,
                userId,
                status,
                features: [feature],
            })
        }
    }

    if (event === "subscription_cancelled") {
        if (existing) {
            await db
                .update(subscriptions)
                .set({
                    status,
                    features: existing.features.filter(f => f !== feature),
                })
                .where(eq(subscriptions.subscriptionId, subscriptionId));
        }
    }


    return c.json({}, 200)
});

export const POST = handle(lemonsqueezyWebhook);