import { Copy } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const AccountBalances = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-normal">Account Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Checking Account</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-2xl font-bold">$12,560.80</p>
            <p className="text-xs text-[#4ECCA3]">+$240.50 today</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Savings Account</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-2xl font-bold">$34,678.20</p>
            <p className="text-xs text-[#4ECCA3]">+$1,240.00 this month</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Business Account</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-2xl font-bold">$7,890.50</p>
            <p className="text-xs text-red-500">-$890.20 this week</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

