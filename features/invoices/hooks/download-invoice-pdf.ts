import { createElement } from "react";
import { Invoice } from "@/features/invoices/types";
import { InvoiceDetails } from "@/features/invoices/components/invoice-details";
import { renderToString } from "react-dom/server";


export async function downloadInvoicePdf(invoice: Invoice) {
    // Get the invoice details HTML
    const invoiceContent = renderToString(createElement(InvoiceDetails, { invoice }));
    
    // Create blob and download
    const blob = new Blob([invoiceContent], { type: 'application/pdf' });

    console.log(blob)
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}