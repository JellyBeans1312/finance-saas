import { OverviewStats } from '@/components/overview-stats'
import { AccountBalances } from '@/components/account-balances'
import { RecentTransactions } from '@/components/recent-transactions'
import { SalesOverview } from '@/components/sales-overview'
import { ExpensesOverview } from '@/components/expenses-overview'
import { Header } from '@/components/layout/Header'
import { WelcomeMsg } from '@/components/layout/WelcomeMsg'
import { ComingSoon } from '@/components/coming-soon'

export default function DashboardPage() {
  return (
    <>
      <ComingSoon
        title="Dashboard"
        description="We're working hard to bring you this feature. Stay tuned!"
      />
      {/* <Header>
        <WelcomeMsg />
      </Header>
      <div className="grid gap-6 w-full px-10 -mt-24">
        <OverviewStats />
        <div className="grid gap-6 md:grid-cols-2 w-full">
          <AccountBalances />
          <RecentTransactions />
        </div>
        <div className="grid gap-6 md:grid-cols-2 w-full">
          <SalesOverview />
          <ExpensesOverview />
        </div>
      </div> */}
    </>
  )
}

