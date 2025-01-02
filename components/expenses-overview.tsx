'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const data = [
  { name: 'Office Supplies', value: 400 },
  { name: 'Utilities', value: 300 },
  { name: 'Rent', value: 300 },
  { name: 'Salaries', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export const ExpensesOverview = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-normal">Expenses Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

