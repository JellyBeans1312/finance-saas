import { Hono } from 'hono';
import { WebhookType } from 'plaid';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { connectedBanks } from '@/db/schema';
import { createUpdateLinkToken } from '@/lib/plaid';
import { handle } from 'hono/vercel';

export const runtime = 'nodejs'

// WEBHOOK TYPES
type ItemWebhookCode = 
  | 'PENDING_EXPIRATION'
  | 'LOGIN_REQUIRED'
  | 'PENDING_DISCONNECT'
  | 'LOGIN_REPAIRED'
  | 'NEW_ACCOUNTS_AVAILABLE'
  | 'ERROR'
  | 'WEBHOOK_UPDATE_ACKNOWLEDGED';

// Enum for better type safety
enum ItemWebhookCodeEnum {
  PendingExpiration = 'PENDING_EXPIRATION',
  LoginRequired = 'LOGIN_REQUIRED',
  PendingDisconnect = 'PENDING_DISCONNECT',
  LoginRepaired = 'LOGIN_REPAIRED',
  NewAccountsAvailable = 'NEW_ACCOUNTS_AVAILABLE',
  Error = 'ERROR',
  WebhookUpdateAcknowledged = 'WEBHOOK_UPDATE_ACKNOWLEDGED'
}

const plaidWebhook = new Hono()
    .post(
        '/',
        async (c) => {
            const webhookData = await c.req.json();
            const {
              webhook_type,
              webhook_code,
              item_id,
            } = webhookData;
        
            console.log(`Received webhook: ${webhook_type} - ${webhook_code}`);
        
            switch(webhook_type) {
              case WebhookType.Item:
                await handleItemWebhook(webhook_code as ItemWebhookCode, item_id);
                break;
            }
        
            return c.json({ received: true }, 200);
          }
        )
        
        async function handleItemWebhook(
          webhookCode: ItemWebhookCode,
          itemId: string
        ) {
          const [connectedBank] = await db
            .select()
            .from(connectedBanks)
            .where(
              eq(connectedBanks.itemId, itemId)
            );
        
          if (!connectedBank) {
            console.error(`No connected bank found for item_id: ${itemId}`);
            return;
          }
        
          switch (webhookCode) {
            case ItemWebhookCodeEnum.PendingExpiration:
              await createUpdateLinkToken(connectedBank);
              await db
                .update(connectedBanks)
                .set({
                  requiresUpdate: true,
                  updateReason: 'PENDING_EXPIRATION'
                })
                .where(eq(connectedBanks.id, connectedBank.id));
              break;
        
            case ItemWebhookCodeEnum.LoginRequired:
              await db
                .update(connectedBanks)
                .set({
                  requiresUpdate: true,
                  updateReason: 'LOGIN_REQUIRED'
                })
                .where(eq(connectedBanks.id, connectedBank.id));
              break;
        
            case ItemWebhookCodeEnum.PendingDisconnect:
              await db
                .update(connectedBanks)
                .set({
                  requiresUpdate: true,
                  updateReason: 'PENDING_DISCONNECT'
                })
                .where(eq(connectedBanks.id, connectedBank.id));
              break;
        
            case ItemWebhookCodeEnum.LoginRepaired:
              await db
                .update(connectedBanks)
                .set({
                  requiresUpdate: false,
                  updateReason: null
                })
                .where(eq(connectedBanks.id, connectedBank.id));
              break;
        
            case ItemWebhookCodeEnum.NewAccountsAvailable:
              await createUpdateLinkToken(connectedBank, { account_selection_enabled: true });
              await db
                .update(connectedBanks)
                .set({
                  requiresUpdate: true,
                  updateReason: 'NEW_ACCOUNTS_AVAILABLE'
                })
                .where(eq(connectedBanks.id, connectedBank.id));
              break;
          }
        }

export default plaidWebhook;