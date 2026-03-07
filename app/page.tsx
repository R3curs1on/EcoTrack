'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { TabNav } from '@/components/layout/tab-nav'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { SpeciesForm } from '@/components/species/species-form'
import { SpeciesGrid } from '@/components/species/species-grid'
import { FoodChainForm } from '@/components/food-chain/food-chain-form'
import { FoodChainVisualizer } from '@/components/food-chain/food-chain-visualizer'
import { SimulationPanel } from '@/components/simulation/simulation-panel'
import { RecordsPanel } from '@/components/records/records-panel'
import { useEcoTrackStore } from '@/lib/store'

export default function Home() {
  const { activeTab } = useEcoTrackStore()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch with localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-xl mx-auto mb-4 animate-pulse" />
          <p className="text-muted">Loading EcoTrack...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNav />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        
        {activeTab === 'species' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SpeciesForm />
            </div>
            <div className="lg:col-span-2">
              <SpeciesGrid />
            </div>
          </div>
        )}
        
        {activeTab === 'food-chain' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <FoodChainForm />
            </div>
            <div className="lg:col-span-2">
              <FoodChainVisualizer />
            </div>
          </div>
        )}
        
        {activeTab === 'simulation' && <SimulationPanel />}
        
        {activeTab === 'records' && <RecordsPanel />}
      </main>
      
      <footer className="border-t border-border py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-muted">
            EcoTrack - Biodiversity Monitoring Dashboard
          </p>
          <p className="text-xs text-subtle mt-1">
            Track populations, monitor food chains, and simulate environmental impacts
          </p>
        </div>
      </footer>
    </div>
  )
}
