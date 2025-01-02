'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const data = [
  { name: 'Jan', invoices: 4000, estimates: 2400 },
  { name: 'Feb', invoices: 3000, estimates: 1398 },
  { name: 'Mar', invoices: 2000, estimates: 9800 },
  { name: 'Apr', invoices: 2780, estimates: 3908 },
  { name: 'May', invoices: 1890, estimates: 4800 },
  { name: 'Jun', invoices: 2390, estimates: 3800 },
]

export const SalesOverview = () => {
  return (
    <>
      <div className='max-w-screen-2xl w-full mx-auto pb-10 grid gap-4 md:grid-cols-3 px-8 -mt-24'>
        <Card>
          <CardHeader>
              <CardTitle className='text-lg'>Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <>
                <p className='text-2xl font-bold'>100</p>
                <p className='text-sm text-muted-foreground'>$1000</p>
            </>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Paid Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <>
                <p className='text-2xl font-bold'>100</p>
                <p className='text-sm text-muted-foreground'>$1000</p>
            </>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Overdue Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <>
                <p className='text-2xl font-bold'>100</p>
                <p className='text-sm text-muted-foreground'>$1000</p>
            </>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base font-normal">Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="invoices" fill="#4ECCA3" />
            <Bar dataKey="estimates" fill="#3498db" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    </>
  )
}

