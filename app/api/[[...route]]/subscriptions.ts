import crypto from 'crypto';
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createCheckout, getSubscription } from "@lemonsqueezy/lemonsqueezy.js";
import { setupLemon } from "@/lib/ls";
import { createId } from '@paralleldrive/cuid2';

setupLemon();

const app = new Hono()
    .get(
        '/current',
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if(!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401);
            };

            const [ subscription ] = await db
            .select()
            .from(subscriptions)
            .where(
                eq(subscriptions.userId, auth.userId)
            )

            return c.json({ data: subscription || null})
        }
    )
    .post(
        '/checkout',
        //TODO: FOR A LA CARTE
        // PASS PARAMS INTO CHECKOUT TO PURCHASE OTHER PORTIONS OF THE APP ---- which will be a 'product' with product id
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if(!auth?.userId) {
                return c.json({ error: 'Unauthorized'}, 401);
            };

            const [ existingSubscription ] = await db
            .select()
            .from(subscriptions)
            .where(
                eq(subscriptions.userId, auth.userId)
            )
            
            if(existingSubscription?.subscriptionId) {
                const subscription = await getSubscription(
                    existingSubscription.subscriptionId,
                );
                const portalUrl = subscription.data?.data.attributes.urls.customer_portal;
                
                if(!portalUrl) {
                    return c.json({ error: 'Internal Error' }, 500);
                }

                return c.json({ data: portalUrl });
            };

            const checkout = await createCheckout( 
                process.env.LEMONSQUEEZY_STORE_ID!,
                process.env.LEMONSQUEEZY_PRODUCT_ID!,
                {
                    checkoutData: {
                        custom: {
                            user_id: auth.userId
                        },
                    },
                    productOptions: {
                        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL!}/`
                    },
                },
            );

            const checkoutUrl = checkout.data?.data.attributes.url;

            if(!checkoutUrl) {
                return c.json({ error: "Internal Error"}, 500)
            }

            return c.json({ data: checkoutUrl });
        }
    )
    .post(
        '/webhook',
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
                    })
                }
            }

            if(event === "subscription_updated") {
                if(existing) {
                    await db
                    .update(subscriptions)
                    .set({
                    status,
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
                    })
                }
            }

            return c.json({}, 200)
        },
    )
export default app;