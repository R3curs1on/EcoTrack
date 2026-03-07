'use client'

import { Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('empty-state animate-fade-in', className)}>
      <div className="w-20 h-20 mb-6 bg-primary-bg rounded-full flex items-center justify-center">
        {icon || <Leaf className="w-10 h-10 text-primary-muted" />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
