'use client'

import { useState } from 'react'
import { FlaskConical, TrendingDown, TrendingUp, X, Network } from 'lucide-react'
import { useEcoTrackStore } from '@/lib/store'
import { EmptyState } from '@/components/shared/empty-state'
import { FoodChainGraph } from '@/components/food-chain/food-chain-graph'
import { cn } from '@/lib/utils'

export function SimulationPanel() {
  const { species, foodChain, simulationResults, showSimulationResults, runSimulation, clearSimulation } = useEcoTrackStore()
  
  const [selectedSpecies, setSelectedSpecies] = useState('')
  const [deathCount, setDeathCount] = useState('')
  const [showGraphSimulation, setShowGraphSimulation] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSpecies || !deathCount) return
    
    runSimulation(selectedSpecies, Number(deathCount))
  }

  if (species.length === 0) {
    return (
      <EmptyState
        icon={<FlaskConical className="w-10 h-10 text-primary-muted" />}
        title="No species to simulate"
        description="Add some species first to run ecosystem impact simulations."
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle - TEMPORARILY DISABLED WITH GRAPH FEATURE */}
      {/* <div className="flex items-center gap-2 p-1 bg-background rounded-button w-fit">
        <button
          onClick={() => setShowGraphSimulation(true)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium transition-all',
            showGraphSimulation 
              ? 'bg-primary text-white shadow-button' 
              : 'text-muted hover:text-body'
          )}
        >
          <Network className="w-4 h-4" />
          Visual Graph
        </button>
        <button
          onClick={() => setShowGraphSimulation(false)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium transition-all',
            !showGraphSimulation 
              ? 'bg-primary text-white shadow-button' 
              : 'text-muted hover:text-body'
          )}
        >
          <FlaskConical className="w-4 h-4" />
          Numeric Simulation
        </button>
      </div> */

      {/* Visual Graph Simulation - TEMPORARILY DISABLED DUE TO CRASHING */}
      {/* {showGraphSimulation && foodChain.length > 0 && (
        <div className="animate-fade-in">
          <FoodChainGraph />
        </div>
      )}

      {showGraphSimulation && foodChain.length === 0 && (
        <div className="card animate-fade-in">
          <EmptyState
            icon={<Network className="w-10 h-10 text-primary-muted" />}
            title="No food chain relationships"
            description="Add predator-prey relationships in the Food Chain tab to visualize cascade simulations."
          />
        </div>
      )} */

      {/* Numeric Simulation Form */}
      {/* Graph is disabled, so always show numeric form */}
      <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent-sky/10 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-accent-sky" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-heading">What If? Simulation</h3>
                <p className="text-sm text-muted">Predict ecosystem impact from population changes</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Species</label>
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="select"
                  required
                >
                  <option value="">Select species</option>
                  {species.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">Simulated Deaths</label>
                <input
                  type="number"
                  value={deathCount}
                  onChange={(e) => setDeathCount(e.target.value)}
                  placeholder="Enter count"
                  min={0}
                  className="input"
                  required
                />
              </div>
              
              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full">
                  <FlaskConical className="w-4 h-4" />
                  Run Simulation
                </button>
              </div>
            </form>
          </div>

          {/* Simulation Results */}
          {showSimulationResults && (
            <div className="card animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-heading">Simulation Results</h3>
                <button
                  onClick={clearSimulation}
                  className="p-1.5 text-muted hover:text-body hover:bg-background rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {simulationResults.length === 0 ? (
                <div className="p-6 bg-background rounded-card text-center">
                  <p className="text-muted">
                    No connected species found. This species has no predator-prey relationships.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {simulationResults.map((result, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        'p-4 rounded-card border-l-4 animate-fade-in',
                        result.impact < 0 
                          ? 'bg-risk-critical/5 border-risk-critical' 
                          : 'bg-risk-least/5 border-risk-least'
                      )}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-heading">{result.species}</h4>
                          <p className="text-sm text-muted mt-0.5">{result.reason}</p>
                        </div>
                        <div className={cn(
                          'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                          result.impact < 0 
                            ? 'bg-risk-critical/10 text-risk-critical' 
                            : 'bg-risk-least/10 text-risk-least'
                        )}>
                          {result.impact < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          {result.impact > 0 ? '+' : ''}{result.impact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        <div className="card animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent-sky/10 rounded-xl flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-accent-sky" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-heading">What If? Simulation</h3>
              <p className="text-sm text-muted">Predict ecosystem impact from population changes</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Species</label>
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="select"
                required
              >
                <option value="">Select species</option>
                {species.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">Simulated Deaths</label>
              <input
                type="number"
                value={deathCount}
                onChange={(e) => setDeathCount(e.target.value)}
                placeholder="Enter count"
                min={0}
                className="input"
                required
              />
            </div>
            
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">
                <FlaskConical className="w-4 h-4" />
                Run Simulation
              </button>
            </div>
          </form>
        </div>

        {/* Simulation Results */}
        {showSimulationResults && (
          <div className="card animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-heading">Simulation Results</h3>
              <button
                onClick={clearSimulation}
                className="p-1.5 text-muted hover:text-body hover:bg-background rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {simulationResults.length === 0 ? (
              <div className="p-6 bg-background rounded-card text-center">
                <p className="text-muted">
                  No connected species found. This species has no predator-prey relationships.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {simulationResults.map((result, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      'p-4 rounded-card border-l-4 animate-fade-in',
                      result.impact < 0 
                        ? 'bg-risk-critical/5 border-risk-critical' 
                        : 'bg-risk-least/5 border-risk-least'
                    )}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-heading">{result.species}</h4>
                        <p className="text-sm text-muted mt-0.5">{result.reason}</p>
                      </div>
                      <div className={cn(
                        'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                        result.impact < 0 
                          ? 'bg-risk-critical/10 text-risk-critical' 
                          : 'bg-risk-least/10 text-risk-least'
                      )}>
                        {result.impact < 0 ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <TrendingUp className="w-4 h-4" />
                        )}
                        {result.impact > 0 ? '+' : ''}{result.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </>
    </div>
  )
}
