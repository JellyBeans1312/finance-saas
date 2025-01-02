ALTER TABLE "connected_banks" ADD COLUMN "item_id" text;--> statement-breakpoint
ALTER TABLE "connected_banks" ADD COLUMN "requires_update" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "connected_banks" ADD COLUMN "update_reason" text;