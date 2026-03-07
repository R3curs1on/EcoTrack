'use client'

import { cn } from '@/lib/utils'
import { RiskLevel } from '@/lib/types'
import { RISK_LEVELS } from '@/lib/constants'
import { getRiskLevelColor } from '@/lib/utils'

interface FilterPillsProps {
  selected: RiskLevel | null
  onChange: (level: RiskLevel | null) => void
}

export function FilterPills({ selected, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          'px-3 py-1.5 text-sm rounded-full transition-all duration-200',
          selected === null
            ? 'bg-primary text-white'
            : 'bg-primary-bg text-body hover:bg-border'
        )}
      >
        All
      </button>
      {RISK_LEVELS.map((level) => (
        <button
          key={level.value}
          onClick={() => onChange(level.value)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full transition-all duration-200 flex items-center gap-1.5'
          )}
          style={{
            backgroundColor: selected === level.value 
              ? getRiskLevelColor(level.value) 
              : 'var(--primary-bg)',
            color: selected === level.value 
              ? 'white' 
              : getRiskLevelColor(level.value),
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: selected === level.value 
                ? 'white' 
                : getRiskLevelColor(level.value) 
            }}
          />
          {level.label}
        </button>
      ))}
    </div>
  )
}
