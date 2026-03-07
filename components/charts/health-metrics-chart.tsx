'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useEcoTrackStore } from '@/lib/store'
import { CHART_COLORS } from '@/lib/constants'

export function HealthMetricsChart() {
  const { species } = useEcoTrackStore()

  const chartData = useMemo(() => {
    if (species.length === 0) return []
    
    // Get top 8 species by population
    const topSpecies = [...species]
      .filter(s => s.isFauna)
      .sort((a, b) => b.population - a.population)
      .slice(0, 8)
    
    return topSpecies.map(s => ({
      name: s.name.length > 10 ? s.name.substring(0, 10) + '...' : s.name,
      fullName: s.name,
      population: s.population,
      change: s.population - s.initialPopulation,
    }))
  }, [species])

  if (chartData.length === 0) {
    return (
      <div className="card animate-slide-up h-[300px] flex items-center justify-center">
        <p className="text-muted">Add fauna species to see health metrics</p>
      </div>
    )
  }

  return (
    <div className="card animate-slide-up">
      <h3 className="text-lg font-semibold text-heading mb-4">Species Population</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={CHART_COLORS.grid} 
              horizontal={false}
            />
            <XAxis 
              type="number"
              tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.grid }}
            />
            <YAxis 
              type="category"
              dataKey="name"
              tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8df',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(45, 90, 61, 0.1)',
              }}
              formatter={(value: number, name: string, props) => {
                if (name === 'Population') {
                  const change = props.payload.change
                  const changeStr = change >= 0 ? `+${change}` : `${change}`
                  return [`${value.toLocaleString()} (${changeStr})`, props.payload.fullName]
                }
                return [value, name]
              }}
              labelFormatter={() => ''}
            />
            <Bar 
              dataKey="population" 
              radius={[0, 4, 4, 0]}
              name="Population"
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.change >= 0 ? CHART_COLORS.primary : CHART_COLORS.critical}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
