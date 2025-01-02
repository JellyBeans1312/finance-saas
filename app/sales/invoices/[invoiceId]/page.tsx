'use client'

import { z } from "zod";
import { useParams } from "next/navigation";
import { invoiceValidationSchema } from "@/db/schema";
import { handlePrintInvoice } from "@/components/print-invoice";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Download, Edit, Printer, ChevronDown, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { useGetInvoice } from "@/features/invoices/api/use-get-invoice";
import { useEditInvoice } from "@/features/invoices/api/use-edit-invoice";
import { useSendInvoice } from "@/features/invoices/api/use-send-invoice";

import { InvoiceForm } from "@/features/invoices/components/invoice-form";
import { InvoiceDetails } from "@/features/invoices/components/invoice-details";

import { usePushEditInvoice } from "@/features/invoices/hooks/use-edit-invoice";
import { downloadInvoicePdf } from "@/features/invoices/hooks/download-invoice-pdf";

import { Invoice, InvoiceStatus } from "@/features/invoices/types";

export const dynamic = 'force-dynamic';

const InvoicePage = () => {
    const invoiceId = useParams().invoiceId as string;

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isEdit = searchParams.get('edit') === 'true';
    
    const { data: invoice, isLoading: isLoadingInvoice } = useGetInvoice(invoiceId);
    const { editInvoice } = usePushEditInvoice();
    const { mutate: editInvoiceMutation } = useEditInvoice(invoiceId);
    const { mutate: sendInvoiceMutation, isPending: isSendingInvoice } = useSendInvoice();
    type FormValues = z.input<typeof invoiceValidationSchema>; 

    const handleSubmit = (data: FormValues) => {
        editInvoiceMutation({
            ...data,
            status: InvoiceStatus.DRAFT
        }, {
            onSuccess: () => {
                router.push(`${pathname}?edit=false`);
            }
        });
    }

    const handleDownloadPDF = () => {
        if(invoice) {
            downloadInvoicePdf(invoice);
        }
    }

    const handleChangeStatus = (status: InvoiceStatus) => {
        editInvoiceMutation({
            status
        });
    }

    const handlePrint = (invoice: Invoice) => {
        handlePrintInvoice(invoice);
    };

    const handleSend = () => {
        sendInvoiceMutation({
            invoiceId,
            message: "Please pay this invoice"
        });
    }

    const isLoading = isLoadingInvoice || isSendingInvoice;

    if(isLoading || !invoice) {
        return <div>Loading...</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-4 -mt-24 md:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Invoice</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">{invoice?.invoiceNumber}</p>
          </div>
          {!isEdit && (
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <Button onClick={handleDownloadPDF}>
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        Status: {invoice?.status} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    {Object.values(InvoiceStatus).map((status) => (
                        <DropdownMenuItem key={status} onClick={() => handleChangeStatus(status)}>
                            {status}
                        </DropdownMenuItem>
                    ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <Button onClick={() => editInvoice(invoiceId, true)} variant="outline">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button onClick={() => handlePrint(invoice)} variant="outline">
                    <Printer className="mr-2 h-4 w-4" /> Print
                </Button> 
                <Button 
                    onClick={handleSend}
                    disabled={isSendingInvoice} 
                    variant="outline"
                >
                    <Send className="mr-2 h-4 w-4" /> Send
                </Button> 
                </div>
            )}
        </div>
       {isEdit ? (
        <InvoiceForm 
            onSubmit={handleSubmit}
            defaultValues={invoice}
            disabled={isLoading}
            isEdit={isEdit}
        />
       ) : (
        <InvoiceDetails invoice={invoice} />
       )}
    </div>
    )
}

export default InvoicePage;