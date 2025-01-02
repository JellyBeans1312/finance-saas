ALTER TABLE "connected_banks" ADD COLUMN "consent_given_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "features" text[] DEFAULT '{"none"}'::text[] NOT NULL;