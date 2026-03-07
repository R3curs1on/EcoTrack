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
  Legend,
} from 'recharts'
import { useEcoTrackStore } from '@/lib/store'
import { CHART_COLORS } from '@/lib/constants'

export function ActivityChart() {
  const { species } = useEcoTrackStore()

  const chartData = useMemo(() => {
    const totalBirths = species.reduce((sum, s) => sum + s.births, 0)
    const totalDeaths = species.reduce((sum, s) => sum + s.deaths, 0)
    
    if (totalBirths === 0 && totalDeaths === 0) return []
    
    // Create simple aggregated data
    return species
      .filter(s => s.births > 0 || s.deaths > 0)
      .map(s => ({
        name: s.name.length > 12 ? s.name.substring(0, 12) + '...' : s.name,
        births: s.births,
        deaths: s.deaths,
      }))
      .slice(0, 6)
  }, [species])

  if (chartData.length === 0) {
    return (
      <div className="card animate-slide-up h-[300px] flex items-center justify-center">
        <p className="text-muted">Record births and deaths to see activity</p>
      </div>
    )
  }

  return (
    <div className="card animate-slide-up">
      <h3 className="text-lg font-semibold text-heading mb-4">Births vs Deaths</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="birthsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.least} stopOpacity={0.4} />
                <stop offset="95%" stopColor={CHART_COLORS.least} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="deathsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.critical} stopOpacity={0.4} />
                <stop offset="95%" stopColor={CHART_COLORS.critical} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={CHART_COLORS.grid} 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.grid }}
            />
            <YAxis 
              tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8df',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(45, 90, 61, 0.1)',
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span style={{ color: '#3d4f42', fontSize: '12px' }}>{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="births"
              stroke={CHART_COLORS.least}
              strokeWidth={2}
              fill="url(#birthsGradient)"
              name="Births"
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="deaths"
              stroke={CHART_COLORS.critical}
              strokeWidth={2}
              fill="url(#deathsGradient)"
              name="Deaths"
              animationDuration={800}
              animationBegin={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
