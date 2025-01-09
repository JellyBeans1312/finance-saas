import Link from 'next/link';

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroupLabel,
    SidebarMenuSub,
    SidebarSeparator,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { 
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from '@/components/ui/collapsible';
import {
    BadgeDollarSign, 
    ChevronDown, 
    FileQuestion, 
    Files, 
    HandCoins, 
    Landmark, 
    LayoutDashboard, 
    Loader2, 
    MessageCircleQuestion, 
    PanelsTopLeft, 
    Receipt, 
    ReceiptText, 
    Settings, 
    Store, 
    Users, 
    WalletCards 
} from 'lucide-react';
import { HeaderLogo } from './HeaderLogo';
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';



const featureGroup = [
    {
        label: 'Banking',
        icon: '',
        subItems: [
            {
                href: '/banking',
                label: 'Overview',
                icon: PanelsTopLeft,
            },
            {
                href: '/banking/accounts',
                label: 'Accounts',
                icon: Landmark,
            },
            {
                href: '/banking/categories',
                label: 'Categories',
                icon: WalletCards,
            },
            {
                href: '/banking/transactions',
                label: 'Transactions',
                icon: Receipt,
            }
        ]
    },
    {
        label: 'Sales',
        icon: '',
        subItems: [
            {
                href: '/sales',
                label: 'Overview',
                icon: PanelsTopLeft,
            },
            {
                href: '/sales/invoices',
                label: 'Invoices',
                icon: Files
            },
            // {
            //     href: '/sales/estimates',
            //     label: 'Estimates',
            //     icon: FileQuestion
            // },
            // {
            //     href: '/sales/customers',
            //     label: 'Customers',
            //     icon: Users
            // },
            // {
            //     href: '/sales/customer-payments',
            //     label: 'Customer Payments',
            //     icon: BadgeDollarSign
            // },
        ]
    },
    // {
    //     label: 'Expenses',
    //     icon: '',
    //     subItems: [
    //         {
    //             href: '/expenses',
    //             label: 'Overview',
    //             icon: PanelsTopLeft,
    //         },
    //         {
    //             href: '/expenses/bills',
    //             label: 'Bills',
    //             icon: ReceiptText,
    //         },
    //         {
    //             href: '/expenses/outgoing-payments',
    //             label: 'Outgoing Payments',
    //             icon: HandCoins,
    //         },
    //         {
    //             href: '/expenses/vendors',
    //             label: 'Vendors',
    //             icon: Store,
    //         },
    //     ]
    // },
    {
        label: 'Help',
        icon: '',
        subItems: [
            {
                href: '/settings',
                label: 'Settings',
                icon: Settings
            },
            // {
            //     href: '/feedback',
            //     label: 'Feedback',
            //     icon: MessageCircleQuestion
            // }
        ]
    },
]

export const NavigationSidebar = () => {
    return (
        <Sidebar>
            <SidebarHeader className='px-4 py-4'>
                <HeaderLogo />
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuButton asChild className='mt-2 px-4 py-4'>
                        <Link href='/'>
                            <LayoutDashboard className='size-4'/>
                            <span>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenu>
            <SidebarSeparator />
                {featureGroup?.map((feature) => (
                    <SidebarMenu key={feature.label}>
                        <Collapsible defaultOpen className='group/collapsible'>
                        <CollapsibleTrigger asChild>
                            <SidebarGroupLabel>
                                {feature.label}
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarGroupLabel>
                        </CollapsibleTrigger>
                            <SidebarMenuItem>
                                <CollapsibleContent>
                                    {feature.subItems?.map((item) => (
                                        <SidebarMenuSub key={item.label}>
                                            <Link href={item.href}>
                                                <SidebarMenuSubButton asChild>
                                                    <div>
                                                        <item.icon />
                                                        <span>{item.label}</span>
                                                    </div>
                                                </SidebarMenuSubButton>
                                            </Link>
                                        </SidebarMenuSub>
                                    ))}
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                ))}
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter className='flex py-4 px-4 justify-start'>
                <ClerkLoaded>
                    <div className='flex items-center'>
                        <UserButton afterSwitchSessionUrl="/"/>
                        <span className='ml-2 text-muted-foreground'>Welcome back!</span>
                    </div>
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-8 animate-spin text-slate-400"/>
                    </ClerkLoading>
            </SidebarFooter>
        </Sidebar>
    )
};