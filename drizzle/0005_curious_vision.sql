ALTER TABLE "invoices" ADD COLUMN "from_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "from_phone" integer;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "from_name" text NOT NULL;