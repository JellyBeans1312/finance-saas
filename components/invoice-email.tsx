import { Invoice } from "@/features/invoices/types";
import { format } from "date-fns";

interface InvoiceEmailProps {
    invoice: Invoice;
    message?: string;
}

export const InvoiceEmail = ({ invoice, message }: InvoiceEmailProps) => {
    return `
        <div style="max-width: 600px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
            <!-- Logo and Header -->
            <div style="margin-bottom: 32px;">
                ${invoice?.imageUrl ? `
                    <img src="${invoice.imageUrl}" alt="Company Logo" style="max-width: 96px; max-height: 96px; object-fit: contain;" />
                ` : ''}
            </div>

            <!-- Optional Message -->
            ${message ? `
                <div style="margin-bottom: 24px; padding: 16px; background-color: #f9fafb; border-radius: 6px;">
                    <p style="margin: 0; color: #4b5563;">${message}</p>
                </div>
            ` : ''}

            <!-- Addresses -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
                <div>
                    <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #111827;">From</h2>
                    <p style="margin: 0 0 4px; font-weight: 500;">${invoice?.fromName}</p>
                    <p style="margin: 0 0 4px;">${invoice?.fromAddress}</p>
                    <p style="margin: 0 0 4px;">${invoice?.fromEmail}</p>
                    <p style="margin: 0;">${invoice?.fromPhone || ''}</p>
                </div>
                <div>
                    <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #111827;">To</h2>
                    <p style="margin: 0 0 4px; font-weight: 500;">${invoice?.clientName}</p>
                    <p style="margin: 0 0 4px;">${invoice?.toAddress}</p>
                    <p style="margin: 0 0 4px;">${invoice?.clientEmail}</p>
                    <p style="margin: 0;">${invoice?.clientPhone || ''}</p>
                </div>
            </div>

            <!-- Invoice Details -->
            <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 32px;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                    <div>
                        <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Invoice Date</p>
                        <p style="font-weight: 500; margin: 0;">${format(new Date(invoice?.issueDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                        <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Due Date</p>
                        <p style="font-weight: 500; margin: 0;">${format(new Date(invoice?.dueDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <div style="grid-column: span 2;">
                        <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Amount Due</p>
                        <p style="font-size: 24px; font-weight: 700; color: #4ECCA3; margin: 0;">$${invoice?.total.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <!-- Line Items -->
            <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 32px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <th style="text-align: left; padding: 12px 16px;">Description</th>
                            <th style="text-align: right; padding: 12px 16px;">Qty</th>
                            <th style="text-align: right; padding: 12px 16px;">Price</th>
                            <th style="text-align: right; padding: 12px 16px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice?.lineItems.map((item) => `
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                <td style="padding: 12px 16px; font-weight: 500;">${item.description}</td>
                                <td style="text-align: right; padding: 12px 16px;">${item.quantity}</td>
                                <td style="text-align: right; padding: 12px 16px;">$${item.unitPrice.toFixed(2)}</td>
                                <td style="text-align: right; padding: 12px 16px;">$${(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Notes and Totals -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 32px;">
                <div style="width: 48%;">
                    <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #111827;">Notes</h2>
                    <p style="color: #6b7280; margin: 0;">${invoice?.notes || ''}</p>
                </div>
                <div style="width: 33%;">
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Subtotal:</span>
                            <span style="font-weight: 500;">$${invoice?.subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Tax (10%):</span>
                            <span style="font-weight: 500;">$${invoice?.tax.toFixed(2)}</span>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700;">
                            <span>Total:</span>
                            <span>$${invoice?.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
                <p style="margin: 0;">Thank you for your business!</p>
            </div>
        </div>
    `;
};