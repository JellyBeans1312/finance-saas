import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpensesOverview } from "@/components/expenses-overview"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const topVendors = [
  { name: "Office Supplies Co", totalExpenses: "$5,678", bills: 12 },
  { name: "TechEquip Inc", totalExpenses: "$4,567", bills: 10 },
  { name: "CleanPro Services", totalExpenses: "$3,456", bills: 8 },
  { name: "Utility Corp", totalExpenses: "$2,345", bills: 6 },
  { name: "Marketing Wizards", totalExpenses: "$1,234", bills: 4 },
]

const budgetProgress = [
  { category: "Office Supplies", spent: 4500, budget: 5000 },
  { category: "Utilities", spent: 2800, budget: 3000 },
  { category: "Rent", spent: 8000, budget: 8000 },
  { category: "Salaries", spent: 35000, budget: 40000 },
]

const ExpensesPage = () => {
  return (
    <div className="space-y-6 w-full px-10 -mt-24">
      <div className="grid gap-6 md:grid-cols-2 w-full">
        <ExpensesOverview />
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base font-normal">Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetProgress.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm font-medium">{`$${item.spent} / $${item.budget}`}</span>
                  </div>
                  <Progress value={(item.spent / item.budget) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base font-normal">Top Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Total Expenses</TableHead>
                <TableHead>Bills</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topVendors.map((vendor) => (
                <TableRow key={vendor.name}>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.totalExpenses}</TableCell>
                  <TableCell>{vendor.bills}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ExpensesPage;