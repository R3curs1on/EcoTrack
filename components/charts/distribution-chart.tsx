'use client'

import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useEcoTrackStore } from '@/lib/store'
import { getRiskLevelLabel, getRiskLevelColor } from '@/lib/utils'
import { RiskLevel } from '@/lib/types'

export function DistributionChart() {
  const { species } = useEcoTrackStore()

  const chartData = useMemo(() => {
    const distribution: Record<RiskLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    
    species.forEach(s => {
      distribution[s.riskLevel]++
    })
    
    return (Object.entries(distribution) as [string, number][])
      .filter(([, count]) => count > 0)
      .map(([level, count]) => ({
        name: getRiskLevelLabel(Number(level) as RiskLevel),
        value: count,
        color: getRiskLevelColor(Number(level) as RiskLevel),
      }))
  }, [species])

  const total = species.length

  if (species.length === 0) {
    return (
      <div className="card animate-slide-up h-[300px] flex items-center justify-center">
        <p className="text-muted">Add species to see distribution</p>
      </div>
    )
  }

  return (
    <div className="card animate-slide-up">
      <h3 className="text-lg font-semibold text-heading mb-4">Risk Distribution</h3>
      <div className="h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              animationDuration={800}
              animationBegin={100}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8df',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(45, 90, 61, 0.1)',
              }}
              formatter={(value: number) => [`${value} species`, 'Count']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-bold text-heading">{total}</p>
            <p className="text-xs text-muted">Species</p>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-body">{entry.name}</span>
            <span className="text-sm text-muted">({entry.value})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
