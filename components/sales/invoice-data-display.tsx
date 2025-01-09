import { Invoice } from "@/features/invoices/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";

interface InvoiceDataDisplayProps {
    invoice: Invoice;
    variant: 'mobile' | 'desktop';
    className?: string;
}

export const InvoiceDataDisplay = ({ invoice, variant, className }: InvoiceDataDisplayProps) => {
    const isMobile = variant === 'mobile';

    return (
        <div className={cn("space-y-4", className)}>
            {/* Amount and Dates */}
            <div className={cn(
                "rounded-lg border bg-card",
                isMobile ? "p-4" : "p-6"
            )}>
                <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <p className="text-sm text-muted-foreground">Amount Due</p>
                        <p className="text-xl font-bold text-primary">
                            ${invoice.total.toFixed(2)}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Issue Date</p>
                            <p className="font-medium">
                                {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Due Date</p>
                            <p className="font-medium">
                                {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="rounded-lg border bg-card overflow-hidden">
                {isMobile ? (
                    <div className="divide-y">
                        {invoice.lineItems.map((item, index) => (
                            <div key={index} className="p-4 space-y-2">
                                <div className="flex justify-between">
                                    <p className="font-medium">{item.description}</p>
                                    <p className="font-medium">
                                        ${(item.quantity * item.unitPrice).toFixed(2)}
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {item.quantity} x ${item.unitPrice.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
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
                            {invoice.lineItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        ${(item.quantity * item.unitPrice).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Totals */}
            <div className="rounded-lg border bg-card p-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>${invoice.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};