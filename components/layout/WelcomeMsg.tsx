'use client';

import { usePathname } from "next/navigation";

export const WelcomeMsg = () => {
    const pathname = usePathname();
    const routeFinal = pathname.split('/').pop() || '';
    const routeHeader = routeFinal?.charAt(0).toUpperCase() + routeFinal?.slice(1);

    return (
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-4xl text-white font-medium ">
                {routeFinal === 'sales' ? 'Sales Overview' : routeHeader}
            </h2>
        </div>
    )
}