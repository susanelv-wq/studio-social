'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface ScheduleDatePickerProps {
  value?: string // ISO date YYYY-MM-DD
  onChange: (date: string | undefined) => void
  placeholder?: string
  className?: string
}

export function ScheduleDatePicker({
  value,
  onChange,
  placeholder = 'Pick date to post',
  className
}: ScheduleDatePickerProps) {
  const [open, setOpen] = useState(false)
  const date = value ? new Date(value + 'T12:00:00') : undefined

  const handleSelect = (d: Date | undefined) => {
    if (!d) {
      onChange(undefined)
      setOpen(false)
      return
    }
    onChange(format(d, 'yyyy-MM-dd'))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value + 'T12:00:00'), 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
        {value && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => {
                onChange(undefined)
                setOpen(false)
              }}
            >
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
