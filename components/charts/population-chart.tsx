'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useEcoTrackStore } from '@/lib/store'
import { CHART_COLORS } from '@/lib/constants'

export function PopulationChart() {
  const { species } = useEcoTrackStore()

  const chartData = useMemo(() => {
    if (species.length === 0) return []
    
    // Aggregate all population history
    const allEvents: { timestamp: Date; population: number; species: string }[] = []
    
    species.forEach(s => {
      s.populationHistory.forEach(record => {
        allEvents.push({
          timestamp: new Date(record.timestamp),
          population: record.population,
          species: s.name,
        })
      })
    })
    
    // Sort by time
    allEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    
    // Create cumulative data points
    const cumulativeData: { time: string; total: number }[] = []
    let runningTotal = 0
    const seenSpecies = new Map<string, number>()
    
    allEvents.forEach(event => {
      seenSpecies.set(event.species, event.population)
      runningTotal = Array.from(seenSpecies.values()).reduce((sum, pop) => sum + pop, 0)
      cumulativeData.push({
        time: new Intl.DateTimeFormat('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(event.timestamp),
        total: runningTotal,
      })
    })
    
    return cumulativeData
  }, [species])

  if (chartData.length === 0) {
    return (
      <div className="card animate-slide-up h-[300px] flex items-center justify-center">
        <p className="text-muted">Add species to see population trends</p>
      </div>
    )
  }

  return (
    <div className="card animate-slide-up">
      <h3 className="text-lg font-semibold text-heading mb-4">Population Trends</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="populationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={CHART_COLORS.grid} 
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.grid }}
            />
            <YAxis 
              tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: `1px solid ${CHART_COLORS.grid}`,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(45, 90, 61, 0.1)',
              }}
              labelStyle={{ color: '#1a3325', fontWeight: 600 }}
              itemStyle={{ color: CHART_COLORS.primary }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              fill="url(#populationGradient)"
              name="Total Population"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
