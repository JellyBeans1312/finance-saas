"use client";

import { useRouter } from 'next/navigation';
import { 
    Edit, 
    MoreHorizontal, 
    Send, 
    Trash, 
    Download, 
    ScanSearch, 
    Copy, 
    BadgeDollarSign,
    Printer,
} from 'lucide-react';

import { useConfirm } from '@/hooks/use-confirm';


import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { useDeleteInvoice } from '@/features/invoices/api/use-delete-invoice';
import { useDuplicateInvoice } from '@/features/invoices/hooks/use-duplicate-invoice';
import { usePushEditInvoice } from '@/features/invoices/hooks/use-edit-invoice';
import { useEditInvoice } from '@/features/invoices/api/use-edit-invoice';
import { InvoiceStatus } from '@/features/invoices/types';
import { useGetInvoice } from '@/features/invoices/api/use-get-invoice';
import { handlePrintInvoice } from '@/components/sales/print-invoice';
import { useSendInvoice } from '@/features/invoices/api/use-send-invoice';
import { useDownloadInvoice } from '@/features/invoices/api/use-download-invoice';

type Props = {
    id: string;
}
// TODO: Add a loading state for the actions
// TODO: Refactor the actions to be more reusable
    // Include handleFunctions in action object to be used onClick
export const Actions = ({ id }: Props) => {
    const { duplicateInvoice } = useDuplicateInvoice();
    const { editInvoice } = usePushEditInvoice();
    const { mutate: editInvoiceMutation } = useEditInvoice(id);
    const router = useRouter();
    const deleteInvoice = useDeleteInvoice(id);
    const { data: invoice } = useGetInvoice(id);
    const { mutate: sendInvoiceMutation, isPending: isSendingInvoice } = useSendInvoice();
    const { mutate: downloadInvoiceMutation, isPending: isDownloadingInvoice } = useDownloadInvoice();

    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete the invoice."
    );

    const handleDuplicateInvoice = () => {
        duplicateInvoice(id);
    };

    const handleEditInvoice = () => {
        editInvoice(id, true);
    };

    const handleViewInvoice = () => {
        router.push(`/sales/invoices/${id}`);
    };

    const handleMarkAsPaid = () => {
        editInvoiceMutation({ status: InvoiceStatus.PAID });
    };
    
    const onDelete = async () => {
        const ok = await confirm();

        if(ok) {
            deleteInvoice.mutate();
        };
    };

    const handlePrint = () => {
        if(invoice) {
            handlePrintInvoice(invoice);
        }
    };

    const handleSend = () => {
        sendInvoiceMutation({
            invoiceId: id,
            message: "Please pay this invoice"
        });
    };

    const handleDownloadPdf = () => {
        if(invoice) {
            downloadInvoiceMutation(invoice);
        }
    };

    const actionMenuItems = [
        {
            label: "Edit",
            icon: <Edit className="size-4 mr-2"/>,
            onClick: handleEditInvoice,
        },
        {
            label: "View",
            icon: <ScanSearch className="size-4 mr-2"/>,
            onClick: handleViewInvoice,
        },
        {
            label: "Duplicate",
            icon: <Copy className="size-4 mr-2"/>,
            onClick: handleDuplicateInvoice,
        },
        {
            label: "Mark as Paid",
            icon: <BadgeDollarSign className="size-4 mr-2"/>,
            onClick: handleMarkAsPaid,
        },
        {
            label: "Send",
            icon: <Send className="size-4 mr-2"/>,
            onClick: handleSend,
        },  
        {
            label: "Download PDF",
            icon: <Download className="size-4 mr-2"/>,
            onClick: handleDownloadPdf,
        },  
        {
            label: "Print",
            icon: <Printer className="size-4 mr-2"/>,
            onClick: handlePrint,
        },
        {
            label: "Delete",
            icon: <Trash className="size-4 mr-2"/>,
            onClick: onDelete,
        },
    ]



    const isPending = deleteInvoice.isPending || isSendingInvoice || isDownloadingInvoice;

    return (
        <>
            <ConfirmationDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className='size-8 p-0'>
                        <MoreHorizontal className='size-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    {actionMenuItems.map((item, key) => (
                        <DropdownMenuItem disabled={isPending} onClick={item.onClick} key={key}>
                            {item.icon}
                            {item.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
};