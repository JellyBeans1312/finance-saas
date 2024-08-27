'use client'
import { InferResponseType } from 'hono';
import { client } from '@/lib/hono';


import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Actions } from './actions'


export type ReponseType = InferResponseType<typeof client.api.accounts.$get, 200>["data"][0]


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
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Name
                    <ArrowUpDown className='size-4 ml-2' />
                </Button>   
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <Actions id={row.original.id}/>
    },
];
