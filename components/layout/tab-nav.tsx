'use client'

import { LayoutDashboard, TreePine, Link, FlaskConical, ClipboardList } from 'lucide-react'
import { useEcoTrackStore } from '@/lib/store'
import { TabId } from '@/lib/types'
import { cn } from '@/lib/utils'

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'species', label: 'Species', icon: <TreePine className="w-4 h-4" /> },
  { id: 'food-chain', label: 'Food Chain', icon: <Link className="w-4 h-4" /> },
  { id: 'simulation', label: 'Simulation', icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'records', label: 'Records', icon: <ClipboardList className="w-4 h-4" /> },
]

export function TabNav() {
  const { activeTab, setActiveTab } = useEcoTrackStore()

  return (
    <nav className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1 -mb-px overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-body hover:border-border'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
