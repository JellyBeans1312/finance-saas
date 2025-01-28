ALTER TABLE "connected_banks" ADD COLUMN "institution_id" text;--> statement-breakpoint
ALTER TABLE "connected_banks" ADD COLUMN "last_successful_update" timestamp;--> statement-breakpoint
ALTER TABLE "connected_banks" ADD COLUMN "last_failed_update" timestamp;--> statement-breakpoint
ALTER TABLE "connected_banks" ADD COLUMN "error_code" text;