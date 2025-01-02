import { UserButton, ClerkLoaded, ClerkLoading} from "@clerk/nextjs"
import { HeaderLogo } from "./HeaderLogo"
import { Navigation } from "@/components/layout/Navigation"
import { Loader2 } from "lucide-react"
import { WelcomeMsg } from "@/components/layout/WelcomeMsg"
import { Filters } from '@/components/layout/Filters';

type Props = {
    children: React.ReactNode
}

export const Header = ({ children }: Props) => {
    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
            <div className="max-w-screen-3xl max-auto">
                {children}
            </div>
        </header>
    )
}