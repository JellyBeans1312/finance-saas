'use client'

// import { Legend, CartesianGrid, Tooltip, YAxis, XAxis, Line } from "recharts"
// import { LineChart, ResponsiveContainer } from "recharts"
// import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
// import { AccountBalances } from "@/components/account-balances"
// import { RecentTransactions } from "@/components/recent-transactions";
import { DataGrid } from "@/components/summary-charts/DataGrid"
import { DataCharts } from "@/components/summary-charts/DataCharts"

const accountActivityData = [
  { name: 'Jan', checking: 4000, savings: 2400, business: 2400 },
  { name: 'Feb', checking: 3000, savings: 1398, business: 2210 },
  { name: 'Mar', checking: 2000, savings: 9800, business: 2290 },
  { name: 'Apr', checking: 2780, savings: 3908, business: 2000 },
  { name: 'May', checking: 1890, savings: 4800, business: 2181 },
  { name: 'Jun', checking: 2390, savings: 3800, business: 2500 },
]


 const BankingOverviewPage = () => {
  return (
    <div className="max-w-screen-3xl mx-auto w-full px-10 pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
    </div>
  )

  // return (
  //   <div className="space-y-6 w-full">
  //     <h1 className="text-3xl font-bold">Banking Overview</h1>
  //     <div className="grid gap-6 md:grid-cols-2 w-full">
  //       <AccountBalances />
  //       <Card className="w-full">
  //         <CardHeader>
  //           <CardTitle className="text-base font-normal">Account Activity</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <ResponsiveContainer width="100%" height={300}>
  //             <LineChart data={accountActivityData}>
  //               <CartesianGrid strokeDasharray="3 3" />
  //               <XAxis dataKey="name" />
  //               <YAxis />
  //               <Tooltip />
  //               <Legend />
  //               <Line type="monotone" dataKey="checking" stroke="#8884d8" />
  //               <Line type="monotone" dataKey="savings" stroke="#82ca9d" />
  //               <Line type="monotone" dataKey="business" stroke="#ffc658" />
  //             </LineChart>
  //           </ResponsiveContainer>
  //         </CardContent>
  //       </Card>
  //     </div>
  //     <RecentTransactions />
  //   </div>
  // )
}
export default BankingOverviewPage