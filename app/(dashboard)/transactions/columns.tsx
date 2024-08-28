'use client'
import { InferResponseType } from 'hono';
import { client } from '@/lib/hono';


import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';
import { AArrowUp } from 'lucide-react';
import { AArrowDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

import { Actions } from './actions';

import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';


export type ReponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0]

// FIX ISSUE ON ALL INSTANCES OF SORTING 

export const columns: ColumnDef<ReponseType>[] = [
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
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Date
                    <ArrowUpDown className='size-4 ml-2' />
                </Button>   
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("date") as Date;
            return (
                <span>
                    {format(date, "MMMM dd, yyyy")}
                </span>
            )
        }
    },
    {
        accessorKey: 'category',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Category
                    <AArrowUp className='size-4 ml-2' />
                </Button>   
            )
        },
        cell: ({ row }) => {
            return (
                <span>
                    {row.original.category}
                </span>
            )
        }
    },
    {    
        accessorKey: 'payee',
            header: ({ column }) => {
                //handleAlphabeticalSwitch
                //Create vairable that changes on click of payee button with default to descending

                // FIX ISSUES ON ALL INSTANCES OF SORTING 
                const alphabetSwitch = column.getIsSorted() === 'asc'
            return (
                <Button 
                    variant="ghost"
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }}
                >
                    Payee 
                    {!alphabetSwitch
                    ?
                    <AArrowUp className="size-4 ml-2" />
                    : 
                    <AArrowDown className="size-4 ml-2" />
                    }
                </Button>
            )
        },
    },
    {
        accessorKey: 'amount',
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
            const amount = parseFloat(row.getValue("amount"))
            return (
                <Badge
                    variant={amount > 0 ? "destructive" : "primary"}
                    className="text-xs font-medium px-3.5 py-2.5"
                >
                    {formatCurrency(amount)}
                </Badge>
            )
        }
    },
    {
        accessorKey: 'account',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Account
                    <AArrowUp className='size-4 ml-2' />
                </Button>   
            )
        },
        cell: ({ row }) => {
            return (
                <span>
                    {row.original.account}
                </span>
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
        id: "actions",
        cell: ({ row }) => <Actions id={row.original.id}/>
    },
];
