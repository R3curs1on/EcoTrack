'use client'

import { useMemo } from 'react'
import { Trash2, ArrowDown, Link } from 'lucide-react'
import { useEcoTrackStore } from '@/lib/store'
import { EmptyState } from '@/components/shared/empty-state'
import { DependencyGraph } from '@/lib/types'
import { ANIMATION_DELAYS } from '@/lib/constants'

export function FoodChainVisualizer() {
  const { species, foodChain, removeFoodChainRelation } = useEcoTrackStore()

  const dependencyGraph = useMemo<DependencyGraph>(() => {
    const graph: DependencyGraph = {}
    
    species.forEach(s => {
      graph[s.name] = { predators: [], prey: [] }
    })
    
    foodChain.forEach(relation => {
      if (graph[relation.predator]) {
        graph[relation.predator].prey.push(relation.prey)
      }
      if (graph[relation.prey]) {
        graph[relation.prey].predators.push(relation.predator)
      }
    })
    
    return graph
  }, [species, foodChain])

  const connectedSpecies = Object.entries(dependencyGraph).filter(
    ([, connections]) => connections.predators.length > 0 || connections.prey.length > 0
  )

  if (foodChain.length === 0) {
    return (
      <EmptyState
        icon={<Link className="w-10 h-10 text-primary-muted" />}
        title="No food chain relationships"
        description="Add predator-prey relationships to visualize the ecosystem's food chain and dependencies."
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Relationships List */}
      <div className="card animate-slide-up">
        <h3 className="text-lg font-semibold text-heading mb-4">
          Relationships ({foodChain.length})
        </h3>
        <div className="space-y-2">
          {foodChain.map((relation, index) => (
            <div 
              key={relation.id} 
              className="flex items-center justify-between p-3 bg-background rounded-button group animate-fade-in"
              style={{ animationDelay: `${index * ANIMATION_DELAYS.stagger}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-heading">{relation.predator}</span>
                <ArrowDown className="w-4 h-4 text-muted rotate-[-90deg]" />
                <span className="text-body">{relation.prey}</span>
              </div>
              <button
                onClick={() => removeFoodChainRelation(relation.id)}
                className="p-1.5 text-muted hover:text-risk-critical hover:bg-risk-critical/5 rounded transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dependency Graph */}
      {connectedSpecies.length > 0 && (
        <div className="card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-lg font-semibold text-heading mb-4">
            Dependency Graph
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedSpecies.map(([speciesName, connections], index) => (
              <div 
                key={speciesName} 
                className="p-4 bg-background rounded-card border border-border animate-fade-in"
                style={{ animationDelay: `${index * ANIMATION_DELAYS.stagger}ms` }}
              >
                <h4 className="font-semibold text-heading mb-3">{speciesName}</h4>
                
                {connections.predators.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-risk-critical mb-2">
                      Eaten by (Predators):
                    </p>
                    <div className="space-y-1">
                      {connections.predators.map((pred) => (
                        <div 
                          key={pred} 
                          className="text-sm px-2 py-1 bg-risk-critical/5 text-risk-critical rounded border-l-2 border-risk-critical"
                        >
                          {pred}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {connections.prey.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-risk-least mb-2">
                      Feeds on (Prey):
                    </p>
                    <div className="space-y-1">
                      {connections.prey.map((preyItem) => (
                        <div 
                          key={preyItem} 
                          className="text-sm px-2 py-1 bg-risk-least/5 text-risk-least rounded border-l-2 border-risk-least"
                        >
                          {preyItem}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
