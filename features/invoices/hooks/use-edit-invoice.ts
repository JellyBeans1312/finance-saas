import { useRouter } from 'next/navigation';


export const usePushEditInvoice = () => {
    const router = useRouter();

    const editInvoice = async (id: string, toggle: boolean) => {
        router.push(`/sales/invoices/${id}?edit=${toggle}`);
    }

    return { editInvoice };
} 