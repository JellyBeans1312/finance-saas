import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const transactions = [
  {
    id: 1,
    name: 'Office Supplies Inc.',
    amount: -250.00,
    date: '2023-06-10',
    type: 'expense',
  },
  {
    id: 2,
    name: 'Client Project Payment',
    amount: 1500.00,
    date: '2023-06-09',
    type: 'income',
  },
  {
    id: 3,
    name: 'Monthly Rent',
    amount: -2000.00,
    date: '2023-06-08',
    type: 'expense',
  },
  {
    id: 4,
    name: 'Freelance Design Work',
    amount: 800.00,
    date: '2023-06-07',
    type: 'income',
  },
]

export const RecentTransactions = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-normal">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-2 ${
                  transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <p className={`text-sm font-medium ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

