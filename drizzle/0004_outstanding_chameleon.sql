ALTER TABLE "invoices" ADD COLUMN "client_phone" integer;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "to_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "from_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "invoice_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
