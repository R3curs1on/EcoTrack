'use client'

import { useMemo } from 'react'
import { Trash2, ArrowRight, Link, Network } from 'lucide-react'
import { useEcoTrackStore } from '@/lib/store'
import { EmptyState } from '@/components/shared/empty-state'
import { FoodChainGraph } from './food-chain-graph'
import { ANIMATION_DELAYS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function FoodChainVisualizer() {
  const { species, foodChain, removeFoodChainRelation } = useEcoTrackStore()

  // Group relationships by predator for better visualization
  const groupedRelations = useMemo(() => {
    const groups: Record<string, string[]> = {}
    foodChain.forEach(relation => {
      if (!groups[relation.predator]) {
        groups[relation.predator] = []
      }
      groups[relation.predator].push(relation.prey)
    })
    return groups
  }, [foodChain])

  if (foodChain.length === 0) {
    return (
      <EmptyState
        icon={<Network className="w-10 h-10 text-primary-muted" />}
        title="No food chain relationships"
        description="Add predator-prey relationships to visualize the ecosystem's food web with interactive graphs."
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Interactive Graph Visualization */}
      {species.length > 0 && <FoodChainGraph />}

      {/* Relationships List */}
      <div className="card animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Link className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-heading">
              Relationships ({foodChain.length})
            </h3>
            <p className="text-sm text-muted">Predator to prey connections</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {Object.entries(groupedRelations).map(([predator, preyList], groupIndex) => {
            const predatorSpecies = species.find(s => s.name === predator)
            
            return (
              <div 
                key={predator}
                className="p-4 bg-background rounded-card border border-border animate-fade-in"
                style={{ animationDelay: `${groupIndex * ANIMATION_DELAYS.stagger}ms` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-heading">{predator}</span>
                  {predatorSpecies && (
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      predatorSpecies.riskLevel === 1 && 'bg-risk-critical/10 text-risk-critical',
                      predatorSpecies.riskLevel === 2 && 'bg-risk-endangered/10 text-risk-endangered',
                      predatorSpecies.riskLevel === 3 && 'bg-risk-vulnerable/10 text-risk-vulnerable',
                      predatorSpecies.riskLevel === 4 && 'bg-risk-near/10 text-risk-near',
                      predatorSpecies.riskLevel === 5 && 'bg-risk-least/10 text-risk-least'
                    )}>
                      {predatorSpecies.isFauna ? 'Fauna' : 'Flora'}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-muted ml-auto" />
                  <span className="text-sm text-muted">feeds on</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {preyList.map((prey) => {
                    const relation = foodChain.find(
                      r => r.predator === predator && r.prey === prey
                    )
                    const preySpecies = species.find(s => s.name === prey)
                    
                    return (
                      <div
                        key={prey}
                        className="group flex items-center gap-2 px-3 py-2 bg-surface rounded-button border border-border hover:border-primary/30 transition-colors"
                      >
                        <span className="text-sm font-medium text-body">{prey}</span>
                        {preySpecies && (
                          <div 
                            className={cn(
                              'w-2 h-2 rounded-full',
                              preySpecies.riskLevel === 1 && 'bg-risk-critical',
                              preySpecies.riskLevel === 2 && 'bg-risk-endangered',
                              preySpecies.riskLevel === 3 && 'bg-risk-vulnerable',
                              preySpecies.riskLevel === 4 && 'bg-risk-near',
                              preySpecies.riskLevel === 5 && 'bg-risk-least'
                            )}
                            title={`Risk Level: ${preySpecies.riskLevel}`}
                          />
                        )}
                        {relation && (
                          <button
                            onClick={() => removeFoodChainRelation(relation.id)}
                            className="p-1 text-muted hover:text-risk-critical hover:bg-risk-critical/5 rounded opacity-0 group-hover:opacity-100 transition-all ml-1"
                            title="Remove relationship"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
