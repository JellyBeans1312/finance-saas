import { Button } from '@/components/ui/button'
import { 
  PlusCircle, 
  Receipt, 
  CreditCard, 
  Users, 
  FileText,
  ArrowRightLeft
} from 'lucide-react'

const actions = [
  {
    label: 'New Transaction',
    icon: PlusCircle,
    href: '/transactions/new',
    color: 'bg-blue-500'
  },
  {
    label: 'Add Invoice',
    icon: Receipt,
    href: '/invoices/new',
    color: 'bg-green-500'
  },
  {
    label: 'Add Expense',
    icon: CreditCard,
    href: '/expenses/new',
    color: 'bg-red-500'
  },
  {
    label: 'Add Client',
    icon: Users,
    href: '/clients/new',
    color: 'bg-purple-500'
  },
  {
    label: 'New Report',
    icon: FileText,
    href: '/reports/new',
    color: 'bg-orange-500'
  },
  {
    label: 'Transfer',
    icon: ArrowRightLeft,
    href: '/transfer',
    color: 'bg-teal-500'
  }
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-gray-50"
            asChild
          >
            <a href={action.href}>
              <div className={`p-2 rounded-full ${action.color}`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm text-gray-600 text-center">
                {action.label}
              </span>
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}