import Link from "next/link";
import Image from "next/image";
import LogoDark from '@/public/logo-dark.svg';
export const HeaderLogo = () => {
    return (
        <Link href="/">
            <div className="items-center hidden lg:flex">
                <Image src={LogoDark} height={28} width={28} alt='logo' />
                <p className="font-semibold text-neutral-900 text-2xl ml-2.5"> CoreLedger </p>
            </div>
        </Link>
    )
}