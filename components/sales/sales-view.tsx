'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SalesOverview } from "@/components/sales-overview"
import { ScrollArea } from "@/components/ui/scroll-area";

const topCustomers = [
  { name: "Acme Corp", totalSales: "$12,345", invoices: 23 },
  { name: "GlobalTech Inc", totalSales: "$10,890", invoices: 19 },
  { name: "MegaSoft Ltd", totalSales: "$9,265", invoices: 17 },
  { name: "TechGiant Co", totalSales: "$7,890", invoices: 15 },
  { name: "InnovateCo", totalSales: "$6,543", invoices: 12 },
]

const MobileCustomerCard = ({ customer }: { customer: typeof topCustomers[0] }) => (
  <Card className="bg-card">
    <CardContent className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{customer.name}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Total Sales</p>
            <p className="font-medium">{customer.totalSales}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Invoices</p>
            <p className="font-medium">{customer.invoices}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const DesktopCustomerTable = () => (
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
);

export const SalesView = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 w-full -mt-24 px-4 md:px-10"
    >
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="space-y-6">
            <SalesOverview />
            
            {isMobile ? (
              <div className="space-y-4">
                <h2 className="text-base font-medium px-1">Top Customers</h2>
                <ScrollArea className="w-full">
                  <div className="space-y-4">
                    {topCustomers.map((customer) => (
                      <MobileCustomerCard key={customer.name} customer={customer} />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <DesktopCustomerTable />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};