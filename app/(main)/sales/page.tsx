import { Suspense } from 'react';
import { motion } from 'framer-motion';
import SalesPageSkeleton from './loading';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { SalesOverview } from "@/components/sales-overview"

const topCustomers = [
  { name: "Acme Corp", totalSales: "$12,345", invoices: 23 },
  { name: "GlobalTech Inc", totalSales: "$10,890", invoices: 19 },
  { name: "MegaSoft Ltd", totalSales: "$9,265", invoices: 17 },
  { name: "TechGiant Co", totalSales: "$7,890", invoices: 15 },
  { name: "InnovateCo", totalSales: "$6,543", invoices: 12 },
]

const SalesPage = () => {
  return (
    <Suspense fallback={<SalesPageSkeleton />}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6 w-full -mt-24 px-10"
      >
        <SalesOverview />
        <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal">Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Invoices</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer) => (
                <TableRow key={customer.name}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.totalSales}</TableCell>
                  <TableCell>{customer.invoices}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CardContent>
        </Card>
        </motion.div>
    </Suspense>
  )
}

export default SalesPage;

