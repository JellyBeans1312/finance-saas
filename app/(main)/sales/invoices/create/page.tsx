'use client'

import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation'

import { useCreateInvoice } from '@/features/invoices/api/use-create-invoice';
import { InvoiceForm } from '@/features/invoices/components/invoice-form';

import { invoiceValidationSchema } from '@/db/schema';
import { useGetInvoice } from '@/features/invoices/api/use-get-invoice';
import { Invoice } from '@/features/invoices/types';


const CreateInvoicePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get('duplicate') as Invoice['id'];
  const createInvoice = useCreateInvoice();
  
  const { data: originalInvoice, isLoading } = useGetInvoice(duplicateId);
  

  const onSubmit = (data: z.infer<typeof invoiceValidationSchema>) => {
    createInvoice.mutate(data, {
      onSuccess: ({ data }) => {
        router.push(`/sales/invoices/${data?.id}`);
      }
    });
  };

  // duplicate invoice values passed to create form
  const defaultValues = duplicateId && originalInvoice ? {
    fromName: originalInvoice.fromName,
    fromEmail: originalInvoice.fromEmail,
    fromPhone: originalInvoice.fromPhone || undefined,
    fromAddress: originalInvoice.fromAddress,
    clientName: originalInvoice.clientName,
    clientEmail: originalInvoice.clientEmail,
    clientPhone: originalInvoice.clientPhone || undefined,
    toAddress: originalInvoice.toAddress,
    notes: originalInvoice.notes || undefined,
    lineItems: originalInvoice.lineItems,
  } : {
    fromName: '',
    fromEmail: '',
    fromPhone: undefined,
    fromAddress: '',
    clientName: '',
    clientEmail: '',
    clientPhone: undefined,
    toAddress: '',
    notes: undefined,
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
  };

  if (duplicateId && isLoading) {
    return (
      <div className="space-y-6 px-8 max-w-screen-lg mx-auto bg-white -mt-24 border md:rounded-md md:p-6">
        <div>Loading invoice data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-8 max-w-screen-lg mx-auto bg-white -mt-24 border md:rounded-md md:p-6">
      <InvoiceForm 
        onSubmit={onSubmit} 
        defaultValues={defaultValues}
        disabled={createInvoice.isPending}
        isEdit={false}
      />  
    </div>
  )
}

export default CreateInvoicePage;