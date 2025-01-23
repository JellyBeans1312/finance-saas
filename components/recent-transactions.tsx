import { ArrowDownLeft, ArrowUpRight, PlusCircle, Landmark } from 'lucide-react'
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button';

type RecentTransactionsProps = {
  recentTransactions: {
    amount: number;
    id: string;
    date: string;
    accountId: string;
    accountName: string;
    categoryName: string | null;
    payee: string;
  }[] | undefined;
}

export const RecentTransactions = ({ recentTransactions }: RecentTransactionsProps) => {

  if(!recentTransactions || recentTransactions.length === 0) return (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">No transactions found</h2>
        <p className="text-sm text-gray-600">It seems you don't have any transactions. Let's create one!</p>
        <div className="flex flex-col items-center space-y-4">
          <Button variant="outline" size="sm" className="w-full">
            <Link href="/banking/transactions">
              Create Your First Transaction
            </Link>
          </Button>
          <p className="text-sm text-gray-600">Or, you can connect your bank account with Plaid for a seamless experience.</p>
          <Button variant="outline" size="sm" className="w-full">
            <Link href="/settings" className="flex items-center gap-x-2">
                <PlusCircle className="h-5 w-5" />
                <Landmark className="h-5 w-5" />
                Connect with Plaid
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-normal">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions?.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-2 ${
                  transaction.categoryName === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {transaction.categoryName === 'income' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.payee}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <p className={`text-sm font-medium ${
                transaction.categoryName === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.categoryName === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

