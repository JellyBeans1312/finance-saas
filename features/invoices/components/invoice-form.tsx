import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Upload } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { Input } from '@/components/ui/input';  
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from '@/components/ui/form';

import { invoiceValidationSchema } from '@/db/schema';
import { LineItem } from '@/features/invoices/types';

type FormValues = z.input<typeof invoiceValidationSchema>;  

type InvoiceFormProps = {
    onSubmit: (data: FormValues) => void;
    defaultValues?: FormValues;
    disabled?: boolean;
    isEdit?: boolean;
}

const formatPhoneNumber = (value: string): string => {
    // Only allow digits and limit to 10 characters
    return value.replace(/\D/g, '').slice(0, 10);
};

export const InvoiceForm = ({ onSubmit, defaultValues, disabled, isEdit }: InvoiceFormProps) => {
    const form = useForm<z.infer<typeof invoiceValidationSchema>>({
        resolver: zodResolver(invoiceValidationSchema),
        defaultValues: defaultValues,
    });

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                form.setValue('imageUrl', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Line item management functions
    const addLineItem = () => {
        const currentLineItems = form.getValues('lineItems') || [];
        form.setValue('lineItems', [...currentLineItems, { description: '', quantity: 1, unitPrice: 0 }]);
};

    const removeLineItem = (index: number) => {
        const currentLineItems = form.getValues('lineItems') || [];
        form.setValue('lineItems', currentLineItems.filter((_, i) => i !== index));
    };

    const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
        const currentLineItems = form.getValues('lineItems') || [];
        const updatedItems = [...currentLineItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        form.setValue('lineItems', updatedItems)
    };

    // Calculation functions
    const calculateSubtotal = () => form.getValues('lineItems')?.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) || 0;
    const calculateTax = () => calculateSubtotal() * 0.1;
    const calculateTotal = () => calculateSubtotal() + calculateTax();

    const handleSubmit = (values: z.infer<typeof invoiceValidationSchema>) => {
        const cleanPhoneNumber = (phone: string) => phone.replace(/\D/g, '');
        console.log('values: ', values);
        const submissionData = {
            ...values, 
            lineItems: values.lineItems,
            imageUrl: values.imageUrl,
            tax: calculateTax(),
            subtotal: calculateSubtotal(),
            total: calculateTotal(),
            clientPhone: cleanPhoneNumber(values.clientPhone || ''),
            fromPhone: cleanPhoneNumber(values.fromPhone || ''),  
        }
        onSubmit(submissionData);
    }

    return (
        <Form {...form}>
            <form onSubmit={
                form.handleSubmit(
                    (data) => handleSubmit(data),
                    (errors) => {
                        console.log('Form validation errors: ', errors);
                        const firstError = Object.keys(errors)[0];
                        const errorElement = document.getElementsByName(firstError)[0];
                        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                )
            } className="space-y-6">
                {/* Error Messages */}
                {Object.keys(form.formState.errors).length > 0 && (
                    <div className="rounded-lg border border-red-500 bg-red-50 p-4">
                        <h3 className="text-red-800 font-medium">Please correct the following errors:</h3>
                        <ul className="list-disc list-inside text-sm text-red-700 mt-2">
                            {Object.entries(form.formState.errors).map(([key, error]) => (
                                <li key={key}>
                                    {error?.message as string}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* From Address Section */}
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <div className="text-2xl font-semibold leading-none tracking-tight">From</div>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="space-y-2">
                                <FormField
                                    name="fromName"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Company Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="fromAddress"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Your Company Address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="fromEmail"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="fromPhone"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Phone {' '}
                                                <span className='text-muted-foreground text-xs'>
                                                    (Optional)
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="tel"
                                                    placeholder="Your Phone Number" 
                                                    {...field} 
                                                    onChange={(e) => {
                                                        const formatted = formatPhoneNumber(e.target.value);
                                                        field.onChange(formatted);
                                                    }}
                                                    value={field.value ?? ''}
                                                    className={form.formState.errors.fromPhone ? 'border-red-500' : ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* To Address Section */}
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <div className="text-2xl font-semibold leading-none tracking-tight">To</div>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="space-y-2">
                                <FormField
                                    name="clientName"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Client Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="toAddress"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Client Address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="clientEmail"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Client Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="clientPhone"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                             Phone {' '}
                                                <span className='text-muted-foreground text-xs'>
                                                    (Optional)
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="tel"
                                                    placeholder="Client Phone Number" 
                                                    {...field} 
                                                    onChange={(e) => {
                                                        const formatted = formatPhoneNumber(e.target.value);
                                                        field.onChange(formatted);
                                                    }}
                                                    value={field.value ?? ''}
                                                    className={form.formState.errors.clientPhone ? 'border-red-500' : ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logo Section */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="text-2xl font-semibold leading-none tracking-tight">Logo</div>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            {form.watch('imageUrl') && (
                                <img src={form.watch('imageUrl')} alt="Invoice logo" className="w-16 h-16 object-contain" />
                            )}
                            <FormField
                                name="imageUrl"
                                control={form.control}
                                render={({ field: { value, onChange, ...field } }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2">
                                                <Label htmlFor="logo-upload" className="cursor-pointer">
                                                    {form.watch('imageUrl') ? (
                                                        <>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    form.setValue('imageUrl', undefined);
                                                                }}
                                                                className="flex items-center justify-center hover:bg-red-500 hover:text-white space-x-2"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span>Remove Logo</span>
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center justify-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md">
                                                            <Upload className="h-4 w-4" />
                                                            <span>Upload Logo</span>  
                                                        </div>
                                                    )}

                                                    <Input
                                                        id="logo-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleLogoUpload}
                                                        {...field}
                                                    />
                                                </Label>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Line Items Section */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="text-2xl font-semibold leading-none tracking-tight">Line Items</div>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {form.watch('lineItems')?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                                                    placeholder="Item description"
                                                    className={
                                                        form.formState.errors.lineItems?.[index]?.description 
                                                        ? 'border-red-500' 
                                                        : ''
                                                    }
                                                />
                                                {form.formState.errors.lineItems?.[index]?.description && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {form.formState.errors.lineItems[index]?.description.message}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value))}
                                                    min={1}
                                                    className={
                                                        form.formState.errors.lineItems?.[index]?.description 
                                                        ? 'border-red-500' 
                                                        : ''
                                                    }
                                                />
                                                {form.formState.errors.lineItems?.[index]?.description && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {form.formState.errors.lineItems[index]?.description.message}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={item.unitPrice}
                                                    onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value))}
                                                    min={0}
                                                    step={0.01}
                                                    className={
                                                        form.formState.errors.lineItems?.[index]?.description 
                                                        ? 'border-red-500' 
                                                        : ''
                                                    }
                                                />
                                                {form.formState.errors.lineItems?.[index]?.description && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {form.formState.errors.lineItems[index]?.description.message}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" type='button' onClick={() => removeLineItem(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <Button type='button' onClick={addLineItem} disabled={disabled} className="mt-4 w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </div>
                </div>
                
                {/* Summary Section */}
                <div className='grid gap-6 md:grid-cols-2'>
                <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="text-2xl font-semibold leading-none tracking-tight">
                            Notes
                            <span className='text-muted-foreground text-xs'>
                                {' '}(Optional)
                            </span>
                        </div>
                    </div>
                    <div className="p-6 pt-0">
                        <Textarea placeholder="Notes" className="h-24" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="text-2xl font-semibold leading-none tracking-tight">Summary</div>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (10%):</span>
                                <span>${calculateTax().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                        </div>
                    </div> 
                </div>
                {!isEdit ? (
                    <Button type='submit' disabled={disabled} className="w-full">
                        {disabled ? 'Creating Invoice...' : 'Create Invoice'}
                    </Button>
                ) : (
                    <Button type='submit' disabled={disabled} className="w-full">
                        {disabled ? 'Updating Invoice...' : 'Update Invoice'}
                    </Button>
                )}
            </form>
        </Form>
    );
};