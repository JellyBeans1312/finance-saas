import { Crown } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ProVersion() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base font-normal">Pro Version</CardTitle>
        <Button variant="outline" size="sm">
          Details
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-start gap-4">
          <Crown className="h-5 w-5 text-yellow-500" />
          <div>
            <h3 className="mb-1 font-medium">More with Premium</h3>
            <p className="text-sm text-muted-foreground">
              Our premium subscription elevate your experience and unlock of
              benefits.
            </p>
          </div>
        </div>
        <div>
          <p className="mb-1 text-sm text-muted-foreground">You&apos;ll Pay</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">$19.99</span>
            <span className="text-sm text-muted-foreground">/ Month</span>
          </div>
        </div>
        <Button className="w-full bg-[#4ECCA3] text-background hover:bg-[#4ECCA3]/90">
          Learn More
        </Button>
      </CardContent>
    </Card>
  )
}

