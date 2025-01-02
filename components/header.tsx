'use client'

import { Bell, Plus, Command } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6 w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="User"
              className="rounded-full"
            />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
          </div>
          <div>
            <h2 className="text-sm font-medium">John Doe</h2>
            <p className="text-xs text-muted-foreground">Welcome back!</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Command className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search or type command"
            className="w-80 pl-8"
          />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button size="sm" className="gap-2 bg-[#4ECCA3] text-background hover:bg-[#4ECCA3]/90">
          <Plus className="h-4 w-4" />
          <span>New Transaction</span>
        </Button>
      </div>
    </header>
  )
}

