import { Hono } from "hono";
import crypto from 'crypto';
import { eq } from "drizzle-orm";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { AppFeatures, subscriptions } from "@/db/schema";
import { cancelSubscription, createCheckout, getSubscription } from "@lemonsqueezy/lemonsqueezy.js";
import { setupLemon } from "@/lib/ls";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";


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

            return c.json({ data: subscription || null })
        }
    )
    .post(
        '/checkout',
        clerkMiddleware(),
        zValidator('json', z.object({
            feature: z.nativeEnum(AppFeatures)
        })),
        async (c) => {
            const auth = getAuth(c);
            const { feature } = await c.req.json() as { feature: AppFeatures };

            if(!auth?.userId) {
                return c.json({ error: 'Unauthorized'}, 401);
            };

            const productMapToFeatures = {
                [AppFeatures.BANKING]: process.env.LEMONSQUEEZY_BANKING_PRODUCT_ID!,
                [AppFeatures.SALES]: process.env.LEMONSQUEEZY_SALES_PRODUCT_ID!,
            };

            if(!productMapToFeatures[feature]) {
                return c.json({ error: 'Invalid feature'}, 400);
            }

            const [ existingSubscription ] = await db
            .select()
            .from(subscriptions)
            .where(
                eq(subscriptions.userId, auth.userId)
            )

            // If they already have this feature, send them to the portal
            if (existingSubscription?.features.includes(feature)) {
                const subscription = await getSubscription(existingSubscription.subscriptionId);
                const portalUrl = subscription.data?.data.attributes.urls.customer_portal;

                if (!portalUrl) {
                    return c.json({ error: 'Internal Error' }, 500);
                }
                return c.json({ error: 'You are already subscribed to this feature', data: portalUrl }, 400)
            }

            try {
                const checkout = await createCheckout(
                    process.env.LEMONSQUEEZY_STORE_ID!,
                    productMapToFeatures[feature],
                    {
                        checkoutData: {
                            custom: {
                                user_id: auth.userId,
                                feature: feature,
                                existing_subscription_id: existingSubscription?.subscriptionId || null,
                            },
                        },
                        productOptions: {
                            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL!}/${feature.toLowerCase()}?checkout=success`
                        },
                    },
                );

                // Add error handling and logging
                if (!checkout?.data?.data.attributes?.url) {
                    console.error('Invalid checkout response:', checkout);
                    return c.json({ error: 'Failed to create checkout' }, 500);
                }

                return c.json({ data: checkout.data.data.attributes.url });
            } catch (error) {
                console.error('Checkout creation error:', error);
                return c.json({ error: 'Failed to create checkout' }, 500);
            }
        }
    )
    .post(
        '/cancel',
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if(!auth?.userId) {
                return c.json({ error: 'Unauthorized'}, 401);
            };

            const [ subscription ] = await db
                .select()
                .from(subscriptions)
                .where(eq(subscriptions.userId, auth.userId));

            if(!subscription) {
                return c.json({ error: 'Subscription not found'}, 404);
            }

            await cancelSubscription(subscription.subscriptionId);

            return c.json({ data: 'Subscription cancelled'});
        }
    )
export default app;