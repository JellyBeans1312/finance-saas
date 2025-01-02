import { 
    integer,
    pgTable,
    text,
    timestamp,
    boolean
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { InvoiceStatus } from '@/features/invoices/types';

// --BANKING--

// Accounts 
export const accounts = pgTable('accounts', {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull()
});

export const accountsRelations = relations(accounts, ({ many }) => ({
    transactions: many(transactions)
}))

export const insertAccountSchema = createInsertSchema(accounts)

// Categories
export const categories = pgTable('categories', {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull()
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions)
}))

export const insertCategorySchema = createInsertSchema(categories);

// Transactions
export const transactions = pgTable('transactions', {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", { mode: "date" }).notNull(),
    accountId: text("account_id").references(() => accounts.id, {
        onDelete: "cascade",
    }).notNull(),
    categoryId: text("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),
    invoiceId: text("invoice_id").references(() => invoices.id, {
        onDelete: 'set null',
    }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id]
    }),
    category: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
    invoice: one(invoices, {
        fields: [transactions.invoiceId],
        references: [invoices.id],
    }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date() as any,
});

export const connectedBanks = pgTable('connected_banks', {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    accessToken: text("access_token").notNull(),
    itemId: text("item_id"),
    requiresUpdate: boolean("requires_update").default(false),
    updateReason: text("update_reason"),
    consentGivenAt: timestamp('consent_given_at').defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    subscriptionId: text("subscription_id").notNull().unique(),
    status: text("status").notNull(),
    features: text('features').array().notNull().default(['none']),
});
// Subscription Features
export const AppFeatures = {
    BANKING: 'BANKING',
    SALES: 'SALES',
} as const;
export type AppFeatures = keyof typeof AppFeatures;

// --SALES--

// Invoice
export const invoices = pgTable('invoices', {
    id: text("id").primaryKey(),
    invoiceNumber: text("invoice_number").notNull().unique(),
    userId: text("user_id").notNull(),
    clientName: text("client_name").notNull(),
    clientEmail: text("client_email").notNull(),
    clientPhone: text("client_phone"),
    issueDate: timestamp("issue_date", { mode: "date" }).notNull(),
    dueDate: timestamp("due_date", { mode: "date" }).notNull(),
    subtotal: integer("subtotal").notNull(), 
    tax: integer("tax").notNull(), 
    total: integer("total").notNull(), 
    status: text("status", { enum: Object.values(InvoiceStatus) as [string, ...string[]] }).notNull().default(InvoiceStatus.DRAFT),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    toAddress: text("to_address").notNull(),
    fromAddress: text("from_address").notNull(),
    imageUrl: text("image_url"),
    fromEmail: text("from_email").notNull(),
    fromPhone: text("from_phone"),
    fromName: text("from_name").notNull(),
});

export const invoiceLineItems = pgTable('invoice_line_items', {
    id: text("id").primaryKey(),
    invoiceId: text("invoice_id").references(() => invoices.id, {
        onDelete: "cascade",
    }).notNull(),
    description: text("description").notNull(),
    quantity: integer("quantity").notNull(),
    unitPrice: integer("unit_price").notNull(), 
    amount: integer("amount").notNull(), 
});

// Invoice Relations
export const invoicesRelations = relations(invoices, ({ many, one }) => ({
    lineItems: many(invoiceLineItems),
    transaction: one(transactions, {
        fields: [invoices.id],
        references: [transactions.invoiceId],
    }),
}));

export const invoiceLineItemsRelations = relations(invoiceLineItems, ({ one }) => ({
    invoice: one(invoices, {
        fields: [invoiceLineItems.invoiceId],
        references: [invoices.id]
    })
}));

export const insertInvoiceSchema = createInsertSchema(invoices);

// Invoice Zod schemas

export const invoiceValidationSchema = z.object({
    fromName: z.string().min(1, "Name is required"),
    fromEmail: z.string().email("Valid email is required"),
    fromPhone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits").optional(),
    fromAddress: z.string().min(1, "Address is required"),
    
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z.string().email("Valid email is required"),
    clientPhone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits").optional(),
    toAddress: z.string().min(1, "Client address is required"),
    
    imageUrl: z.string().optional(),
    notes: z.string().optional(),
    lineItems: z.array(z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.number().min(1, "Quantity is required"),
        unitPrice: z.number().min(1, "Unit price is required"),
    })),
    status: z.enum(Object.values(InvoiceStatus) as [string, ...string[]]).optional(),
});

export const insertInvoiceLineItemSchema = createInsertSchema(invoiceLineItems);