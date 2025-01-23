'use client';

import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'


type OverviewStatsProps = {
    bankingOverview: {
      totalIncome: number;
      totalExpenses: number;
    };
    salesOverview: {
      totalInvoices: number;
      totalAmount: number;
      paidAmount: number;
      overdueAmount: number;
    }
}

export const OverviewStats = ({ bankingOverview, salesOverview }: OverviewStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${bankingOverview?.totalIncome}</div>
          <p className="text-xs text-muted-foreground">
            {/* <span className="text-[#4ECCA3] mr-1">+20.1%</span> from last month */}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">
            {/* <span className="text-[#4ECCA3] mr-1">+180.1%</span> from last month */}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${bankingOverview?.totalExpenses}</div>
          <p className="text-xs text-muted-foreground">
            {/* <span className="text-red-500 mr-1">+19%</span> from last month */}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Invoices</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{salesOverview?.totalInvoices}</div>
          <p className="text-xs text-muted-foreground">
            {/* <span className="text-[#4ECCA3] mr-1">+201</span> from last month */}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

