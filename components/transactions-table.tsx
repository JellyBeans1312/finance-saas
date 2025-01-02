import { Filter } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const transactions = [
  {
    type: 'Company',
    amount: '$1,500.00',
    status: 'Waiting',
    method: 'Credit Card •••• 3560',
    date: 'Aug 24, 2024',
  },
  {
    type: 'Vera K.',
    amount: '$800.00',
    status: 'Success',
    method: 'Bank Transfer •••• 4275',
    date: 'Aug 18, 2024',
  },
  {
    type: 'Birthday',
    amount: '$240.00',
    status: 'Due Date',
    method: 'Credit Card •••• 9052',
    date: 'Aug 8, 2024',
  },
  {
    type: 'Rifqy A.',
    amount: '$240.00',
    status: 'Disabled',
    method: 'Bank Transfer •••• 2093',
    date: 'Aug 2, 2024',
  },
]

export function TransactionsTable() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base font-normal">
          Recent Transactions
        </CardTitle>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TYPE</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>METHOD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.type}>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                      {
                        Waiting: 'bg-yellow-500/20 text-yellow-500',
                        Success: 'bg-green-500/20 text-green-500',
                        'Due Date': 'bg-red-500/20 text-red-500',
                        Disabled: 'bg-gray-500/20 text-gray-500',
                      }[transaction.status]
                    }`}
                  >
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell>{transaction.method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

