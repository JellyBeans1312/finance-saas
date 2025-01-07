import { Hono } from 'hono';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { handle } from 'hono/vercel';
import { subscriptions } from '@/db/schema';
import { createId } from '@paralleldrive/cuid2';

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

            if(!signature) {
                return c.json({ error: "Unauthorized"}, 401)
            }

            if(!crypto.timingSafeEqual(digest, signature)) {
                return c.json({ error: "Unauthorized"}, 401)
            }

            const payload = JSON.parse(text);
            const event = payload.meta.event_name;

            const subscriptionId = payload.data.id;
            const userId = payload.meta.custom_data.user_id;
            const status = payload.data.attributes.status;
            const feature = payload.meta.custom_data.feature;
            const existingSubscriptionId = payload.meta.custom_data.existing_subscription_id;
            const [ existing ] = await db
                .select()
                .from(subscriptions)
                .where(
                    existingSubscriptionId ?
                        eq(subscriptions.subscriptionId, existingSubscriptionId) :
                    eq(subscriptions.userId, userId)
                )

            if(event === "subscription_created") {
                if(existing) {
                    await db
                    .update(subscriptions)
                    .set({
                        status,
                        features: Array.from(new Set([...existing.features, feature]))
                    })
                    .where(
                        eq(subscriptions.subscriptionId, existing.id)
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
                    features: Array.from(new Set([...existing.features, feature])),
                    })
                    .where(
                        eq(subscriptions.id, existing.id)
                    )
                }
            }

            if (event === "subscription_cancelled") {
                if (existing) {
                    const updatedFeatures = existing.features.filter((feature) => feature !== feature);
                    if(updatedFeatures.length === 0) {
                        await db
                        .update(subscriptions)
                        .set({ status })
                        .where(eq(subscriptions.id, existing.id));
                    } else {
                        await db
                        .update(subscriptions)
                        .set({ features: updatedFeatures })
                        .where(eq(subscriptions.id, existing.id));
                    }
                }
            }


            return c.json({}, 200)
});

export default lemonsqueezyWebhook;