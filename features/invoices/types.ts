export interface Invoice {
    id: string,
    invoiceNumber: string,
    userId: string,
    clientName: string,
    clientEmail: string,
    clientPhone?: string | undefined,
    issueDate: Date,
    dueDate: Date,
    subtotal: number,
    tax: number,
    total: number,
    status: InvoiceStatus,
    notes?: string | undefined,
    createdAt: Date,
    updatedAt: Date,
    toAddress: string,
    fromAddress: string,
    imageUrl?: string | undefined,
    fromEmail: string,
    fromPhone?: string | undefined,
    fromName: string,
    lineItems: LineItem[],
}

export interface LineItem {
    description: string,
    quantity: number,
    unitPrice: number,
    amount: number,
    invoiceId: string,
}

export enum InvoiceStatus {
    DRAFT = 'Draft',
    PAID = 'Paid',
    OVERDUE = 'Overdue',
    PENDING = 'Pending',
    CANCELLED = 'Cancelled'
}

export interface PDFCacheEntry {
    buffer: Buffer;
    timestamp: number;
}

export interface CompressionResult {
    buffer: Buffer;
    size: number;
}