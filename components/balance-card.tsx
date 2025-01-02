import { Copy } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function BalanceCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-normal">Your Balance</CardTitle>
          <Button variant="outline" size="sm">
            US Dollar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold">$20,088.38</h2>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-[#4ECCA3]">
            Compared to last month +24.17%
          </p>
        </div>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm font-normal">
              Finance Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              is updating health status now ...
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

