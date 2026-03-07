'use client'

import { useMemo } from 'react'
import { TreePine, Bug, AlertTriangle, TrendingUp, Heart, Skull } from 'lucide-react'
import { useEcoTrackStore } from '@/lib/store'
import { StatCard } from './stat-card'
import { PopulationChart } from '@/components/charts/population-chart'
import { DistributionChart } from '@/components/charts/distribution-chart'
import { HealthMetricsChart } from '@/components/charts/health-metrics-chart'
import { ActivityChart } from '@/components/charts/activity-chart'
import { calculateEcosystemStats, formatNumber } from '@/lib/utils'
import { EmptyState } from '@/components/shared/empty-state'

export function DashboardView() {
  const { species, foodChain, relocationQueue } = useEcoTrackStore()

  const stats = useMemo(() => calculateEcosystemStats(species), [species])

  if (species.length === 0) {
    return (
      <EmptyState
        icon={<TreePine className="w-12 h-12 text-primary-muted" />}
        title="Welcome to EcoTrack"
        description="Start by adding species to your ecosystem. Track populations, monitor food chains, and simulate environmental impacts."
        action={
          <button 
            onClick={() => useEcoTrackStore.getState().setActiveTab('species')}
            className="btn-primary"
          >
            Add Your First Species
          </button>
        }
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Species"
          value={stats.totalSpecies}
          icon={<TreePine className="w-5 h-5" />}
          delay={0}
        />
        <StatCard
          label="Total Population"
          value={formatNumber(stats.totalPopulation)}
          change={stats.totalBirths - stats.totalDeaths}
          icon={<Bug className="w-5 h-5" />}
          delay={50}
        />
        <StatCard
          label="Fauna"
          value={stats.faunaCount}
          icon={<Bug className="w-5 h-5" />}
          delay={100}
        />
        <StatCard
          label="Flora"
          value={stats.floraCount}
          icon={<TreePine className="w-5 h-5" />}
          delay={150}
        />
        <StatCard
          label="Total Births"
          value={formatNumber(stats.totalBirths)}
          icon={<Heart className="w-5 h-5" />}
          delay={200}
        />
        <StatCard
          label="Total Deaths"
          value={formatNumber(stats.totalDeaths)}
          icon={<Skull className="w-5 h-5" />}
          delay={250}
        />
      </div>

      {/* Alert Banner */}
      {(stats.criticalSpecies > 0 || relocationQueue.length > 0) && (
        <div className="p-4 bg-risk-critical/5 border border-risk-critical/20 rounded-card animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-risk-critical/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-risk-critical" />
            </div>
            <div>
              <h4 className="font-semibold text-heading">Conservation Alert</h4>
              <p className="text-sm text-muted">
                {stats.criticalSpecies > 0 && (
                  <span>{stats.criticalSpecies} critically endangered species. </span>
                )}
                {relocationQueue.length > 0 && (
                  <span>{relocationQueue.length} species in relocation queue.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopulationChart />
        <DistributionChart />
        <HealthMetricsChart />
        <ActivityChart />
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-bg rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted">Food Chain Relations</p>
              <p className="text-2xl font-bold text-heading">{foodChain.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card animate-slide-up" style={{ animationDelay: '350ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-risk-endangered/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-risk-endangered" />
            </div>
            <div>
              <p className="text-sm text-muted">Priority Queue</p>
              <p className="text-2xl font-bold text-heading">{relocationQueue.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-risk-critical/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-risk-critical" />
            </div>
            <div>
              <p className="text-sm text-muted">At-Risk Species</p>
              <p className="text-2xl font-bold text-heading">{stats.endangeredSpecies}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
