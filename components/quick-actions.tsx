import { ArrowRight, Send } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base font-normal">Quick Action</CardTitle>
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Button variant="outline" className="justify-between">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Money
            </div>
            <span className="text-xs">N</span>
          </Button>
          <Button variant="outline" className="justify-between">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Request Money
            </div>
            <span className="text-xs">R</span>
          </Button>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-medium">MY GOALS</h3>
          <div className="grid gap-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Married</span>
                <span>$12,500.00</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                Achieved in 2 months!
              </p>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Basketball</span>
                <span>$4,800.00</span>
              </div>
              <Progress value={60} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                Achieved in 4 months!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

