import { Header } from '@/components/layout/Header'
import { WelcomeMsg } from '@/components/layout/WelcomeMsg'
import { DashboardView } from '@/components/dashboard/dashboard-view'

export default function DashboardPage() {
  return (
    <>
      <Header>
        <WelcomeMsg />
      </Header>
      <DashboardView />
    </>
  )
}