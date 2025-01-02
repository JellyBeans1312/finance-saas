import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";

import { Invoice } from "@/features/invoices/types";

interface InvoiceDetailsProps {
    invoice: Invoice;
    message?: string;
}

export const InvoiceDetails = ({ invoice, message }: InvoiceDetailsProps) => {
    return (
        <>
        <div className="invoice-details flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
            {invoice?.imageUrl && (
                <img src={invoice?.imageUrl} alt="Company Logo" className="w-24 h-24 object-contain mt-4 md:mt-0" />
            )}
        </div>
    </div>
    {/* Addresses */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 address-grid">
        <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">From</h2>
            <p className="font-medium">{invoice?.fromName}</p>
            <p>{invoice?.fromAddress}</p>
            <p>{invoice?.fromEmail}</p>
            <p>{invoice?.fromPhone}</p>
        </div>
        <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">To</h2>
            <p className="font-medium">{invoice?.clientName}</p>
            <p>{invoice?.toAddress}</p>
            <p>{invoice?.clientEmail}</p>
            <p>{invoice?.clientPhone}</p>
        </div>
        </div>

        {/* Invoice Details */}
        <Card className="mb-8">
        <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Invoice Date</p>
                <p className="font-medium">{format(new Date(invoice?.issueDate || ''), 'MMM dd, yyyy')}</p>
            </div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                <p className="font-medium">{format(new Date(invoice?.dueDate || ''), 'MMM dd, yyyy')}</p>
            </div>
            <div className="col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount Due</p>
                <p className="text-2xl font-bold text-primary">${invoice?.total.toFixed(2)}</p>
            </div>
        </div>
      </CardContent>
    </Card>

    {/* Line Items */}
    <Card className="mb-8">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice?.lineItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    {/* Notes */}
    <div className="flex flex-col md:flex-row justify-between mb-8">
      <div className="mb-4 md:mb-0 md:w-1/2">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Notes</h2>
        <p className="text-gray-600 dark:text-gray-400">{invoice?.notes}</p>
      </div>
      <div className="md:w-1/3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="font-medium">${invoice?.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tax (10%):</span>
            <span className="font-medium">${invoice?.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${invoice?.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
                <p>Thank you for your business!</p>
            </div>
        </>
    )
}   