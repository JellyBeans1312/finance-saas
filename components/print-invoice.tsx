import { createElement } from "react";
import { Invoice } from "@/features/invoices/types";
import { InvoiceDetails } from "@/features/invoices/components/invoice-details";
import { renderToString } from "react-dom/server";

export async function handlePrintInvoice(invoice: Invoice) {
    // Open a new window with just the invoice content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get the invoice details HTML
    const styleSheets = Array.from(document.styleSheets);
const styleContent = styleSheets
  .map(sheet => {
      try {
          return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
      } catch (e) {
          // Skip external stylesheets that might cause CORS issues
          return '';
      }
  })
  .join('\n');


const invoiceContent = renderToString(createElement(InvoiceDetails, { invoice }));

if(!invoiceContent) {
console.error('Invoice content not found');
return;
};

printWindow.document.write(`
  <html>
      <head>
          <title>Invoice ${invoice?.invoiceNumber}</title>
          <style>
              ${styleContent}
              /* Additional print-specific styles */
              @media print {
                  body { 
                      print-color-adjust: exact; 
                      -webkit-print-color-adjust: exact;
                      padding: 0;
                      margin: 0;
                  }
                  @page {
                      margin: 20mm;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    page-break-inside: avoid;
                  }
                  .print-container  {
                    page-break-inside: avoid;
                    page-break-after: auto;
                  }
                  /* Force grid layout in print */
                  .address-grid {
                      display: grid !important;
                      grid-template-columns: 1fr 1fr !important;
                      gap: 2rem !important;
                      margin-bottom: 2rem !important;
                  }
                  /* Ensure flex layouts work in print */
                  .flex {
                      display: flex !important;
                  }
                  .flex-row {
                      flex-direction: row !important;
                  }
              }
          </style>
      </head>
      <body>
        <div class="print-container max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg">
          ${invoiceContent || ''}
        </div>
          <script>
            Promise.all(
                  Array.from(document.images)
                      .filter(img => !img.complete)
                      .map(img => new Promise(resolve => {
                          img.onload = img.onerror = resolve;
                      }))
              ).then(() => {
                  setTimeout(() => {
                      window.print();
                      window.onafterprint = () => window.close();
                  }, 500);
              });
          </script>
      </body>
  </html>
`);
printWindow.document.close();
}