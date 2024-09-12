import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const HeaderLogo = () => {
    return (
        <Link href="/">
            <div className="items-center hidden lg:flex">
                <Image src={'./logo.svg'} height={28} width={28} alt='logo' className="animate-[spin_2s_linear_1]"/>
                <p className="font-semibold text-white text-2xl ml-2.5"> Finance application </p>
            </div>
        </Link>
    )
}