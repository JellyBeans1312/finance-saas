'use client'

import { z } from "zod";
import { useParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { invoiceValidationSchema } from "@/db/schema";
import { handlePrintInvoice } from "@/components/sales/print-invoice";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Download, Edit, Printer, ChevronDown, Send, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
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
    const isMobile = useMediaQuery("(max-width: 768px)");
    const invoiceId = useParams().invoiceId as string;

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isEdit = searchParams.get('edit') === 'true';
    
    const { data: invoice, isLoading: isLoadingInvoice } = useGetInvoice(invoiceId);
    const { editInvoice } = usePushEditInvoice();
    const { mutate: editInvoiceMutation } = useEditInvoice(invoiceId);
    const { mutate: sendInvoiceMutation, isPending: isSendingInvoice } = useSendInvoice();

    const handleSubmit = (data: z.input<typeof invoiceValidationSchema>) => {
        editInvoiceMutation({
            ...data,
            status: InvoiceStatus.DRAFT
        }, {
            onSuccess: () => router.push(`${pathname}?edit=false`)
        });
    }

    const handleSend = () => {
        sendInvoiceMutation({
            invoiceId,
            message: "Please pay this invoice"
        });
    }
    
    const actions = [
        {
            label: 'Download PDF',
            icon: Download,
            onClick: () => invoice && downloadInvoicePdf(invoice)
        },
        {
            label: 'Edit',
            icon: Edit,
            onClick: () => editInvoice(invoiceId, true)
        },
        {
            label: 'Print',
            icon: Printer,
            onClick: () => invoice && handlePrintInvoice(invoice)
        },
        {
            label: 'Send',
            icon: Send,
            onClick: handleSend,
            disabled: isSendingInvoice
        }
    ];

   
    const handleChangeStatus = (status: InvoiceStatus) => {
        editInvoiceMutation({ status });
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
                    <>
                        {isMobile ? (
                            <div className="flex items-center gap-2 mt-4 w-full">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex-1">
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

                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom" className="h-[40vh]">
                                        <SheetHeader>
                                            <SheetTitle>Invoice Actions</SheetTitle>
                                        </SheetHeader>
                                        <div className="grid gap-4 py-4">
                                            {actions.map((action) => (
                                                <Button
                                                    key={action.label}
                                                    onClick={action.onClick}
                                                    disabled={action.disabled}
                                                    variant="outline"
                                                    className="w-full justify-start"
                                                >
                                                    <action.icon className="mr-2 h-4 w-4" />
                                                    {action.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                                {actions.map((action) => (
                                    <Button
                                        key={action.label}
                                        onClick={action.onClick}
                                        disabled={action.disabled}
                                        variant="outline"
                                    >
                                        <action.icon className="mr-2 h-4 w-4" />
                                        {action.label}
                                    </Button>
                                ))}
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
                            </div>
                        )}
                    </>
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
    );
}

export default InvoicePage;