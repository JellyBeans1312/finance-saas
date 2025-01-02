'use client'
import { format } from 'date-fns';

import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';
import { AArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';


import { formatCurrency } from '@/lib/utils';
import { Invoice } from '@/features/invoices/types';
import { Actions } from './actions';


// FIX ISSUE ON ALL INSTANCES OF SORTING 

export const columns: ColumnDef<Invoice>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() || 
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select All'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select Row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'invoiceNumber',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Invoice #
                    <AArrowUp className='size-4 ml-2' />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <span>
                    {row.original.invoiceNumber}
                </span>
            )
        }
    },
    {
        accessorKey: 'issueDate',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Issue Date
                    <ArrowUpDown className='size-4 ml-2' />
                </Button>   
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("issueDate") as Date;
            return (
                <span>
                    {format(date, "MMMM dd, yyyy")}
                </span>
            )
        }
    },
    {
        accessorKey: 'dueDate',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Due Date
                    <ArrowUpDown className='size-4 ml-2' />
                </Button>   
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("dueDate") as Date;
            return (
                <span>
                    {format(date, "MMMM dd, yyyy")}
                </span>
            )
        }
    },
    {
        accessorKey: 'clientName',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Client
                    <AArrowUp className='size-4 ml-2' />
                </Button>   
            )
        },
        cell: ({ row }) => {
            const clientName = row.original.clientName;

            return <p className='line-clamp-1'>{clientName}</p>
        }        
    },
    {
        accessorKey: 'total',
        header: ({ column }) => {
            return (
                <Button 
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Amount 
                    <ArrowUpDown className="size-4 ml-2" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total"))
            return (
                <Badge
                    variant={amount < 0 ? "destructive" : "primary"}
                    className="text-xs font-medium px-3.5 py-2.5"
                >
                    {formatCurrency(amount)}
                </Badge>
            )
        }
    },
    {
        accessorKey: 'notes',
        header: ({ column }) => {
            return (
                <Button 
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Notes 
                </Button>
            )
        }
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Status
                  <ArrowUpDown className="ml-1 size-4" />
                </Button>
              )
        },
        cell: ({ row }) => {
            const status = row.original.status;
            const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
            
            return <Badge variant={status}>{formattedStatus}</Badge>
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return <Actions id={row.original.id}/>
        }
    }
];