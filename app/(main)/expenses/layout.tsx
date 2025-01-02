import { Filters } from "@/components/layout/Filters";
import { Header } from "@/components/layout/Header";
import { WelcomeMsg } from "@/components/layout/WelcomeMsg";

type Props = {
    children: React.ReactNode
}

const ExpensesLayout = ({children} : Props) => {
    return ( 
        <>
        <main className="w-full">
            <Header>
                <WelcomeMsg/>
            </Header>
            {children}
        </main>
        </>
    )
}

export default ExpensesLayout;