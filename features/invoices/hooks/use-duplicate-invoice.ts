import { useRouter } from 'next/navigation';


export const useDuplicateInvoice = () => {
    const router = useRouter();

    const duplicateInvoice = async (id: string) => {
        router.push(`/sales/invoices/create?duplicate=${id}`);
    }

    return { duplicateInvoice };
} 