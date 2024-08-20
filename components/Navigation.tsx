'use client';
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { NavButton } from "./NavButton";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const routes = [
    {
        href: '/',
        label: 'Overview'
    },
    {
        href:'/transactions',
        label: 'Transactions'
    },
    {
        href:'/accounts',
        label: 'Accounts'
    },
    {
        href:'/categories',
        label: 'Categories'
    },
    {
        href:'/settings',
        label: 'Settings'
    }
]

export const Navigation = () => {
    const [isOpen, setOpen] = useState(false);
    const router = useRouter();
    const isMobile = useMedia("(max-width: 1024px)", false);
    const pathname = usePathname();
    
    const onClick = (href: string) => {
        router.push(href)
        setOpen(false)
    };
    
    if(isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setOpen}> 
                <SheetTrigger>
                    <Button variant="outline" size="sm" className="font-normal bg-white/10 hover:bg-white/20 hover:text-white focus-visible:ring-offset-0 
                    focus-visible:ring-transparent focus:bg-white/30 transition border-none"  >
                        <Menu className="size-4"/>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map((route) => {
                            return (
                                <Button 
                                    variant={route.href=== pathname ? "secondary":"ghost"} 
                                    key={route.href}
                                    onClick={() => onClick(route.href)}
                                    className="w-full justify-start"
                                >
                                    {route.label}
                                </Button>
                            )
                        })}
                    </nav>

                </SheetContent>
             </Sheet>
        )
    }
    
    return (
        <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
            {routes.map((route) => {
               return (
                    <NavButton 
                        key={route.href}
                        href={route.href}
                        label={route.label}
                        isActive={pathname === route.href}
                    />
               )
            })}
        </nav>
    )
}