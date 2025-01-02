ALTER TABLE "connected_banks" ALTER COLUMN "consent_given_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "connected_banks" ALTER COLUMN "consent_given_at" SET NOT NULL;