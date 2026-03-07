'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  delay?: number
}

export function StatCard({ label, value, change, changeLabel, icon, delay = 0 }: StatCardProps) {
  const getTrendIcon = () => {
    if (!change || change === 0) return <Minus className="w-3 h-3" />
    return change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />
  }

  return (
    <div 
      className="card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted mb-1">{label}</p>
          <p className="text-3xl font-bold text-heading">{value}</p>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              change > 0 ? 'text-risk-least' : change < 0 ? 'text-risk-critical' : 'text-muted'
            )}>
              {getTrendIcon()}
              <span>
                {change > 0 ? '+' : ''}{change} {changeLabel || ''}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-primary-bg rounded-xl flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
