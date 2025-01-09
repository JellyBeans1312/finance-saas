'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Landmark, 
    Receipt, 
    Settings,
    PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { AppFeatures } from '@/db/schema';

const routes = [
    {
        href: '/',
        label: 'Dashboard',
        icon: LayoutDashboard
    },
    {
        href: '/banking',
        label: 'Banking',
        icon: Landmark,
        feature: AppFeatures.BANKING
    },
    {
        href: '/sales',
        label: 'Sales',
        icon: Receipt,
        feature: AppFeatures.SALES
    },
    {
        href: '/settings',
        label: 'Settings',
        icon: Settings
    }
];

export const MobileNav = () => {
    const pathname = usePathname();
    const { hasFeature } = useFeatureAccess();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
            <div className="flex items-center justify-around">
                {routes.map((route) => {
                    if (route.feature && !hasFeature(route.feature)) {
                        return null;
                    }

                    const isActive = pathname === route.href;

                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex flex-col items-center gap-y-1 p-3 text-muted-foreground",
                                isActive && "text-primary"
                            )}
                        >
                            <route.icon className="size-5" />
                            <span className="text-xs font-medium">
                                {route.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};