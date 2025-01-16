import { z } from 'zod';
import { Hono } from 'hono';
import { Resend } from 'resend';
import { eq, count, and, inArray, lte, gte, sum, sql } from 'drizzle-orm';
import { addDays } from 'date-fns';
import { getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { deleteLogoFromS3, uploadLogoToS3 } from '@/lib/s3';

import { InvoiceEmail } from '@/components/sales/invoice-email';

import { db } from '@/db/drizzle';
import {
    invoices,
    invoiceLineItems,
    insertInvoiceSchema,
} from '@/db/schema';

import { createId } from '@paralleldrive/cuid2';
import { InvoiceStatus } from '@/features/invoices/types';
import { generateInvoicePDF } from '@/features/invoices/hooks/generate-invoice-pdf';

// Only validate what we need from the client
import { invoiceValidationSchema } from '@/db/schema';

import { clerkConfig } from '@/lib/clerk';

// Generate a unique invoice number
async function generateInvoiceNumber(): Promise<string> {
    const [result] = await db.select({ count: count() })
        .from(invoices);
    
    const nextNumber = Number(result.count) + 1;
    return `INV-${String(nextNumber).padStart(6, '0')}`;
}


const app = new Hono()
.post(
    '/',
    clerkConfig,
    zValidator("json", invoiceValidationSchema),
    async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401);
        }

        // Calculate totals
        const subtotal = values.lineItems.reduce(
            (sum, item) => sum + (item.quantity * item.unitPrice),
            0
        );
        const tax = Math.round(subtotal * 0.1); // 10% tax
        const total = subtotal + tax;
        const issueDate = new Date();
        const dueDate = addDays(issueDate, 30);

        // Handle logo upload if present
        let imageUrl = values.imageUrl;
        if (imageUrl && imageUrl.startsWith('data:image')) {
            try {
                const fileName = `${auth.userId}-${createId()}`; // Create unique filename
                imageUrl = await uploadLogoToS3(imageUrl, fileName);
            } catch (error) {
                console.error('Error uploading logo:', error);
                return c.json({ error: "Failed to upload logo" }, 500);
            }
        }

        //handle optional values
        const invoiceData = {
            id: createId(),
            userId: auth.userId,
            invoiceNumber: await generateInvoiceNumber(),
            clientName: values.clientName,
            clientEmail: values.clientEmail,
            clientPhone: values.clientPhone || undefined,
            issueDate,
            dueDate,
            subtotal,
            tax,
            total,
            status: InvoiceStatus.DRAFT,
            fromPhone: values.fromPhone || undefined,
            fromAddress: values.fromAddress,
            fromEmail: values.fromEmail,
            fromName: values.fromName,
            toAddress: values.toAddress,
            notes: values.notes || undefined,
            imageUrl: imageUrl || undefined,
        } as const;

        // Create invoice
        const [invoice] = await db.insert(invoices)
        .values(invoiceData)
        .returning();
        
        // Create line items
        await db.insert(invoiceLineItems).values(
            values.lineItems.map((item) => ({
                id: createId(),
                invoiceId: invoice.id,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.quantity * item.unitPrice,
            }))
        );

        // Fetch complete invoice with line items
        const completeInvoice = await db.query.invoices.findFirst({
            where: eq(invoices.id, invoice.id),
            with: {
                lineItems: true,
            },
        });

        return c.json({ data: completeInvoice });
    }
)
.get(
    "/",
    clerkConfig,
    async (c) => {
        const auth = getAuth(c);

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401) 
        }

        const data = await db.query.invoices.findMany({
            where: eq(invoices.userId, auth.userId),
            with: {
                lineItems: true,
            },
        })

        return c.json({ data })
  })
  .get(
    "/:id",
    zValidator("param", z.object({
        id: z.string().optional(),
    })),
    clerkConfig,
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if(!id) {
            return c.json({ error: "Missing id" }, 400);
        };

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        };

        const lineItems = await db.query.invoiceLineItems.findMany({
            where: eq(invoiceLineItems.invoiceId, id),
        });
        
        const [ data ] = await db
        .select()
        .from(invoices)
        .where(
            and(
                eq(invoices.userId, auth.userId),
                eq(invoices.id, id)
            ),
        );

        if(!data) {
            return c.json({ error: "Not Found" }, 404);
        };
        return c.json({
            data: {
                ...data,
                lineItems,
            },
        });
    }
  )
  .post(
    "/bulk-delete",
    clerkConfig,
    zValidator(
        "json",
        z.object({
            ids: z.array(z.string()),
        }),
    ),
    async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401);
        }

        const data = await db
            .delete(invoices)
            .where(
                and(
                    eq(invoices.userId, auth.userId), 
                    inArray(invoices.id, values.ids)
                )
            ).returning({
                id: invoices.id
            });
            return c.json({ data })
        }
  )
  .patch(
    "/:id",
    clerkConfig,
    zValidator(
        "param",
        z.object({ id: z.string().optional()})
    ),
    zValidator(
        "json",
        insertInvoiceSchema.pick({
            clientName: true,
            clientEmail: true,
            issueDate: true,
            dueDate: true,
            status: true,
            notes: true,
            imageUrl: true,
        }).partial()
    ),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");
        const values = c.req.valid("json");

        if (!id) {
            return c.json({ error: "Missing Id"}, 400);
        };

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401)
        };

        // First, get the existing invoice to check for old image
        const [existingInvoice] = await db
        .select()
        .from(invoices)
        .where(
            and(
                eq(invoices.userId, auth.userId),
                eq(invoices.id, id)
            )
        );

        if (!existingInvoice) {
            return c.json({ error: "Not Found" }, 404);
        }

        let imageUrl = values.imageUrl;

            // Case 1: New image uploaded
            if (imageUrl && imageUrl.startsWith('data:image')) {
                // Delete old image if it exists
                if (existingInvoice.imageUrl) {
                    await deleteLogoFromS3(existingInvoice.imageUrl);
                }
                // Upload new image
                const fileName = `${auth.userId}-${createId()}`;
                imageUrl = await uploadLogoToS3(imageUrl, fileName);
            }
            // Case 2: Image removed
            else if (imageUrl === null && existingInvoice.imageUrl) {
                await deleteLogoFromS3(existingInvoice.imageUrl);
            }
            // Case 3: No image change (keep existing URL)
            else if (imageUrl === undefined) {
                imageUrl = existingInvoice.imageUrl;
            }
        const [ data ] = await db
        .update(invoices)
        .set({
            ...values,
            imageUrl,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(invoices.userId, auth.userId),
                eq(invoices.id, id),
            )
        ).returning();
        
        if(!data) {
            return c.json({ error: "Not Found"}, 404);
        };
        return c.json({ data })
    }
  )
  .delete(
    "/:id",
    clerkConfig,
    zValidator(
        "param",
        z.object({ id: z.string().optional() })
    ),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if (!id) {
            return c.json({ error: "Missing Id"}, 400);
        };

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401)
        };

        const [existingInvoice] = await db
        .select()
        .from(invoices)
        .where(
            and(
                eq(invoices.userId, auth.userId),
                eq(invoices.id, id)
            )
        );

        if (!existingInvoice) {
            return c.json({ error: "Not Found" }, 404);
        }

        // Delete logo if it exists
        if (existingInvoice.imageUrl) {
            await deleteLogoFromS3(existingInvoice.imageUrl);
        }

        const [ data ] = await db
        .delete(invoices)
        .where(
            and(
                eq(invoices.userId, auth.userId),
                eq(invoices.id, id),
            )
        ).returning({
            id: invoices.id
        });
        
        if(!data) {
            return c.json({ error: "Not Found"}, 404);
        };

        return c.json({ data })
    }
  )
  // Send Invoice via Resend
  .post(
    '/send-invoice',
    clerkConfig,
    zValidator('json', z.object({
        invoiceId: z.string(),
        message: z.string().optional(),
    })),
    async (c) => {
        const auth = getAuth(c);
        const { invoiceId, message } = c.req.valid('json');

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401);
        }

        const invoice = await db.query.invoices.findFirst({
            where: eq(invoices.id, invoiceId),
            with: {
                lineItems: true,
            },
        });

        if(!invoice) {
            return c.json({ error: "Invoice not found"}, 404);
        }
        
        const invoiceData = {
            ...invoice,
            clientPhone: invoice.clientPhone || undefined,
            fromPhone: invoice.fromPhone || undefined,
            notes: invoice.notes || undefined,
            imageUrl: invoice.imageUrl || undefined,
            status: invoice.status as InvoiceStatus,
        } as const;

        const pdfBuffer = await generateInvoicePDF(invoiceData, message);
        
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const { data } = await resend.emails.send({
            from: "your-domain@resend.dev",
            to: invoice.clientEmail,
            subject: `Invoice ${invoice.invoiceNumber} from ${invoice.fromName}`,
            html: InvoiceEmail({ invoice: invoiceData, message }),
            attachments: [
                {
                    filename: `invoice-${invoice.invoiceNumber}.pdf`,
                    content: pdfBuffer,
                },
            ],
        });

        console.log(data);

        // Update invoice status
        await db.update(invoices)
            .set({ 
                status: InvoiceStatus.PENDING,
                updatedAt: new Date()
            })
            .where(eq(invoices.id, invoiceId));

        return c.json({ data });
    }
  )
  // MOVE THIS TO SUMMARY 
  .get(
    '/summary',
    clerkConfig,
    async (c) => {
        const auth = getAuth(c);

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401)
        };

        const data = await db.query.invoices.findMany({
            where: eq(invoices.userId, auth.userId),
        });

        // Start of Summary to be moved to summary.ts
        async function getInvoiceSummary(
            userId: string,
            startDate: Date,
            endDate: Date
        ) {
            const totalInvoices = await db.select({
                total: count(),
                amount: sum(invoices.total),
            })
            .from(invoices)
            .where(
                and(
                    eq(invoices.userId, userId),
                    gte(invoices.issueDate, startDate),
                    lte(invoices.issueDate, endDate),
                )
            );

            const paidInvoices = await db.select({
                total: sql`SUM(CASE WHEN ${invoices.status} = 'PAID' THEN 1 ELSE 0 END)`.mapWith(Number),
                amount: sql`SUM(CASE WHEN ${invoices.status} = 'PAID' THEN ${invoices.total} ELSE 0 END)`.mapWith(Number),
            })
            .from(invoices)
            .where(
                and(
                    eq(invoices.userId, userId),
                    eq(invoices.status, InvoiceStatus.PAID),
                    gte(invoices.issueDate, startDate),
                    lte(invoices.issueDate, endDate),
                )
            );

            const overdueInvoices = await db.select({
                total: sql`SUM(CASE WHEN ${invoices.status} = 'OVERDUE' THEN 1 ELSE 0 END)`.mapWith(Number),
                amount: sql`SUM(CASE WHEN ${invoices.status} = 'OVERDUE' THEN ${invoices.total} ELSE 0 END)`.mapWith(Number),
            })
            .from(invoices)
            .where(
                and(
                    eq(invoices.userId, userId),
                    eq(invoices.status, InvoiceStatus.OVERDUE),
                    gte(invoices.issueDate, startDate),
                    lte(invoices.issueDate, endDate),
                )
            );
        }
    

        // TODO: Add date range
        // TODO: Add user inputed start and end date. Select from date range.

        // Calculate the percentage change over the course of a previous period and current period.
    }
  )

export default app;