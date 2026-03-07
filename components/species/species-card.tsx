'use client'

import { Trash2, AlertTriangle, TreePine, Bug } from 'lucide-react'
import { Species } from '@/lib/types'
import { useEcoTrackStore } from '@/lib/store'
import { cn, getRiskLevelLabel, getRiskLevelBadgeClass, getSpeciesAlert, formatNumber } from '@/lib/utils'

interface SpeciesCardProps {
  species: Species
  delay?: number
}

export function SpeciesCard({ species, delay = 0 }: SpeciesCardProps) {
  const { removeSpecies } = useEcoTrackStore()
  const alert = getSpeciesAlert(species)
  const change = species.population - species.initialPopulation

  return (
    <div 
      className="card-interactive group animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            species.isFauna ? 'bg-accent-warm/10' : 'bg-primary-bg'
          )}>
            {species.isFauna ? (
              <Bug className="w-5 h-5 text-accent-warm" />
            ) : (
              <TreePine className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-heading">{species.name}</h4>
            <span className={getRiskLevelBadgeClass(species.riskLevel)}>
              {getRiskLevelLabel(species.riskLevel)}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => removeSpecies(species.id)}
          className="p-2 text-muted hover:text-risk-critical hover:bg-risk-critical/5 rounded-button transition-all opacity-0 group-hover:opacity-100"
          title="Remove species"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {alert && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-risk-critical/10 rounded-button text-risk-critical text-sm font-medium">
          <AlertTriangle className="w-4 h-4" />
          {alert}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 bg-background rounded-button">
          <p className="text-muted text-xs mb-0.5">
            {species.isFauna ? 'Population' : 'Biomass'}
          </p>
          <p className="font-semibold text-heading">
            {species.isFauna ? formatNumber(species.population) : `${formatNumber(species.biomass)}t`}
          </p>
        </div>
        
        <div className="p-3 bg-background rounded-button">
          <p className="text-muted text-xs mb-0.5">Change</p>
          <p className={cn(
            'font-semibold',
            change > 0 ? 'text-risk-least' : change < 0 ? 'text-risk-critical' : 'text-muted'
          )}>
            {change > 0 ? '+' : ''}{formatNumber(change)}
          </p>
        </div>
        
        <div className="p-3 bg-background rounded-button">
          <p className="text-muted text-xs mb-0.5">Births</p>
          <p className="font-semibold text-risk-least">+{formatNumber(species.births)}</p>
        </div>
        
        <div className="p-3 bg-background rounded-button">
          <p className="text-muted text-xs mb-0.5">Deaths</p>
          <p className="font-semibold text-risk-critical">-{formatNumber(species.deaths)}</p>
        </div>
      </div>
    </div>
  )
}
