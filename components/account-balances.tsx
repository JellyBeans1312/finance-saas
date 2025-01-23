import { Copy, PlusCircle, Landmark } from 'lucide-react'
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type AccountBalancesProps = {
    accounts: {
      balance: number;
      accountId: string;
      accountName: string;
      lastUpdated: string;
    }[] | undefined;
}

export const AccountBalances = ({ accounts }: AccountBalancesProps) => {
  const accountItems = accounts?.map((account) => {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{account.accountName}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => {
              navigator.clipboard.writeText(account.balance.toString());
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-2xl font-bold">${account.balance}</p>
        <p className="text-xs text-[#4ECCA3]">+$240.50 today</p>
    </div>
    )
  });

  if(!accounts || accounts.length === 0) return (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">No accounts found</h2>
        <p className="text-sm text-gray-600">It seems you don't have any accounts yet. Let's get started!</p>
        <div className="flex flex-col items-center space-y-4">
          <Button variant="outline" size="sm" className="w-full">
            <Link href="/banking/accounts">
              Create Your First Account
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
        <CardTitle className="text-base font-normal">Account Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accountItems}
        </div>
      </CardContent>
    </Card>
  )
}

