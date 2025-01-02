'use client'

import { Card, CardContent } from '@/components/ui/card'

export function Calendar() {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const currentDate = 10

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {days.map((day) => (
            <div key={day} className="text-muted-foreground">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
            <div
              key={date}
              className={`flex h-8 items-center justify-center rounded-full ${
                date === currentDate
                  ? 'bg-[#4ECCA3] text-background'
                  : 'hover:bg-muted'
              }`}
            >
              {date}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

