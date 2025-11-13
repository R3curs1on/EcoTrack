'use client'

import { useState, useMemo } from 'react'

interface Species {
  name: string
  riskLevel: number
  population: number
  isFauna: boolean
  biomass: number
  initialPopulation: number
  births: number
  deaths: number
}

interface FoodChainRelation {
  predator: string
  prey: string
}

interface SimulationResult {
  species: string
  impact: number
  reason: string
}

export default function Home() {
  const [species, setSpecies] = useState<Species[]>([])
  const [foodChain, setFoodChain] = useState<FoodChainRelation[]>([])
  const [relocationQueue, setRelocationQueue] = useState<string[]>([])
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])
  const [showSimulation, setShowSimulation] = useState(false)
  
  // Form states
  const [speciesName, setSpeciesName] = useState('')
  const [riskLevel, setRiskLevel] = useState(3)
  const [isFauna, setIsFauna] = useState(true)
  const [measure, setMeasure] = useState(0)
  const [predator, setPredator] = useState('')
  const [prey, setPrey] = useState('')
  const [deathSpecies, setDeathSpecies] = useState('')
  const [deathCount, setDeathCount] = useState(0)
  const [birthSpecies, setBirthSpecies] = useState('')
  const [birthCount, setBirthCount] = useState(0)
  const [simulationSpecies, setSimulationSpecies] = useState('')
  const [simulationDeaths, setSimulationDeaths] = useState(0)

  const addSpecies = (e: React.FormEvent) => {
    e.preventDefault()
    if (!speciesName.trim()) return

    const newSpecies: Species = {
      name: speciesName,
      riskLevel,
      population: isFauna ? measure : 0,
      isFauna,
      biomass: isFauna ? 0 : measure,
      initialPopulation: isFauna ? measure : 0,
      births: 0,
      deaths: 0
    }

    setSpecies(prev => [...prev, newSpecies])
    
    if (riskLevel <= 2) {
      setRelocationQueue(prev => [...prev, speciesName])
    }

    setSpeciesName('')
    setMeasure(0)
  }

  const addFoodChainRelation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!predator.trim() || !prey.trim()) return

    setFoodChain(prev => [...prev, { predator, prey }])
    setPredator('')
    setPrey('')
  }

  const recordDeath = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deathSpecies.trim()) return

    setSpecies(prev => prev.map(s => {
      if (s.name === deathSpecies) {
        const newPopulation = Math.max(0, s.population - deathCount)
        return { ...s, population: newPopulation, deaths: s.deaths + deathCount }
      }
      return s
    }))

    // Apply cascade effects
    applyCascadeEffects(deathSpecies, deathCount)

    setDeathSpecies('')
    setDeathCount(0)
  }

  const recordBirth = (e: React.FormEvent) => {
    e.preventDefault()
    if (!birthSpecies.trim()) return

    setSpecies(prev => prev.map(s => {
      if (s.name === birthSpecies) {
        const newPopulation = s.population + birthCount
        if (newPopulation >= 50 && relocationQueue.includes(s.name)) {
          setRelocationQueue(queue => queue.filter(name => name !== s.name))
        }
        return { ...s, population: newPopulation, births: s.births + birthCount }
      }
      return s
    }))

    setBirthSpecies('')
    setBirthCount(0)
  }

  // Function to apply cascade effects when a species dies
  const applyCascadeEffects = (deadSpecies: string, deathCount: number) => {
    // Find all species that depend on the dead species (predators)
    const affectedPredators = foodChain
      .filter(rel => rel.prey === deadSpecies)
      .map(rel => rel.predator)
    
    // Find all species that the dead species preyed upon (prey)
    const affectedPrey = foodChain
      .filter(rel => rel.predator === deadSpecies)
      .map(rel => rel.prey)

    setSpecies(prev => prev.map(s => {
      // Predators suffer when their prey dies (lose 20% of deaths)
      if (affectedPredators.includes(s.name)) {
        const impact = Math.floor(deathCount * 0.2)
        const newPopulation = Math.max(0, s.population - impact)
        return { ...s, population: newPopulation }
      }
      // Prey populations may increase when predator dies (gain 10% of deaths)
      if (affectedPrey.includes(s.name)) {
        const impact = Math.floor(deathCount * 0.1)
        const newPopulation = s.population + impact
        return { ...s, population: newPopulation }
      }
      return s
    }))
  }

  // Simulate "What if?" scenario
  const simulateWhatIf = (e: React.FormEvent) => {
    e.preventDefault()
    if (!simulationSpecies.trim()) return

    const results: SimulationResult[] = []
    
    // Find affected predators
    const affectedPredators = foodChain
      .filter(rel => rel.prey === simulationSpecies)
      .map(rel => rel.predator)
    
    // Find affected prey
    const affectedPrey = foodChain
      .filter(rel => rel.predator === simulationSpecies)
      .map(rel => rel.prey)

    affectedPredators.forEach(predator => {
      const impact = Math.floor(simulationDeaths * 0.2)
      results.push({
        species: predator,
        impact: -impact,
        reason: `Predator loses food source (${simulationSpecies})`
      })
    })

    affectedPrey.forEach(prey => {
      const impact = Math.floor(simulationDeaths * 0.1)
      results.push({
        species: prey,
        impact: impact,
        reason: `Prey population increases due to reduced predation`
      })
    })

    setSimulationResults(results)
    setShowSimulation(true)
  }

  const simulateRecovery = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recoverySpecies.trim()) return

    setSpecies(prev => prev.map(s => {
      if (s.name === recoverySpecies) {
        const newPopulation = s.population + recoveryAmount
        if (newPopulation >= 50 && relocationQueue.includes(s.name)) {
          setRelocationQueue(queue => queue.filter(name => name !== s.name))
        }
        return { ...s, population: newPopulation }
      }
      return s
    }))

    setRecoverySpecies('')
    setRecoveryAmount(0)
  }

  const sortedSpecies = [...species].sort((a, b) => a.riskLevel - b.riskLevel)

  // Build dependency graph data structure
  const dependencyGraph = useMemo(() => {
    const graph: { [key: string]: { predators: string[], prey: string[] } } = {}
    
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

  const getRiskLevelColor = (risk: number) => {
    if (risk <= 1) return 'text-red-600'
    if (risk === 2) return 'text-orange-500'
    if (risk === 3) return 'text-yellow-500'
    if (risk === 4) return 'text-blue-500'
    return 'text-green-500'
  }

  const getRiskLevelBg = (risk: number) => {
    if (risk <= 1) return 'bg-red-100'
    if (risk === 2) return 'bg-orange-100'
    if (risk === 3) return 'bg-yellow-100'
    if (risk === 4) return 'bg-blue-100'
    return 'bg-green-100'
  }

  const getAlert = (s: Species) => {
    if (s.population <= 0) return '⚠️ EXTINCT'
    if (s.population < 50 && s.isFauna) return '⚠️ CRITICAL'
    if (s.riskLevel === 1) return '⚠️ HIGHLY ENDANGERED'
    return ''
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">
            🌿 EcoTrack - Biodiversity Tracker
          </h1>
          <p className="text-gray-600">Monitor and manage species populations and food chain relationships</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Add Species Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">➕ Add Species</h2>
            <form onSubmit={addSpecies} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Species Name</label>
                <input
                  type="text"
                  value={speciesName}
                  onChange={(e) => setSpeciesName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter species name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Level (1=High, 5=Low): {riskLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFauna"
                  checked={isFauna}
                  onChange={(e) => setIsFauna(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="isFauna" className="text-sm font-medium text-gray-700">
                  Is Fauna (Animal)?
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isFauna ? 'Population' : 'Biomass (tons)'}
                </label>
                <input
                  type="number"
                  value={measure}
                  onChange={(e) => setMeasure(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Add Species
              </button>
            </form>
          </div>

          {/* Add Food Chain Relation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">🔗 Add Food Chain Relation</h2>
            <form onSubmit={addFoodChainRelation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Predator</label>
                <input
                  type="text"
                  value={predator}
                  onChange={(e) => setPredator(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter predator name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prey</label>
                <input
                  type="text"
                  value={prey}
                  onChange={(e) => setPrey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter prey name"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Add Relation
              </button>
            </form>

            {foodChain.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Food Chain Relations:</h3>
                <div className="space-y-2">
                  {foodChain.map((relation, idx) => (
                    <div key={idx} className="text-sm bg-blue-50 p-2 rounded">
                      {relation.predator} → {relation.prey}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Record Death */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-700 mb-4">💀 Record Species Death</h2>
            <form onSubmit={recordDeath} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Species Name</label>
                <select
                  value={deathSpecies}
                  onChange={(e) => setDeathSpecies(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select species</option>
                  {species.map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Deaths</label>
                <input
                  type="number"
                  value={deathCount}
                  onChange={(e) => setDeathCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Record Death
              </button>
            </form>
          </div>

          {/* Simulate Recovery */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">👶 Record Species Birth</h2>
            <form onSubmit={recordBirth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Species Name</label>
                <select
                  value={birthSpecies}
                  onChange={(e) => setBirthSpecies(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select species</option>
                  {species.map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Births</label>
                <input
                  type="number"
                  value={birthCount}
                  onChange={(e) => setBirthCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Record Birth
              </button>
            </form>
          </div>
        </div>

        {/* What If Simulation */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">🔮 What If? Simulation</h2>
          <p className="text-gray-600 mb-4">Simulate the ecosystem impact if a species population decreases</p>
          <form onSubmit={simulateWhatIf} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
              <select
                value={simulationSpecies}
                onChange={(e) => setSimulationSpecies(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select species</option>
                {species.map((s, idx) => (
                  <option key={idx} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Simulated Deaths</label>
              <input
                type="number"
                value={simulationDeaths}
                onChange={(e) => setSimulationDeaths(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
              >
                Run Simulation
              </button>
            </div>
          </form>

          {showSimulation && simulationResults.length > 0 && (
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-purple-200">
              <h3 className="font-bold text-lg text-purple-800 mb-3">Simulation Results:</h3>
              <div className="space-y-2">
                {simulationResults.map((result, idx) => (
                  <div key={idx} className={`p-3 rounded-lg ${result.impact < 0 ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
                    <div className="font-semibold">{result.species}</div>
                    <div className={`text-sm ${result.impact < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      Impact: {result.impact > 0 ? '+' : ''}{result.impact} population
                    </div>
                    <div className="text-xs text-gray-600">{result.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showSimulation && simulationResults.length === 0 && (
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-gray-200">
              <p className="text-gray-600 text-center">No connected species found. This species has no predator-prey relationships.</p>
            </div>
          )}
        </div>

        {/* Species Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Species by Risk Level */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">📊 Species by Risk Level</h2>
            {sortedSpecies.length === 0 ? (
              <p className="text-gray-500">No species added yet.</p>
            ) : (
              <div className="space-y-3">
                {sortedSpecies.map((s, idx) => {
                  const change = s.population - s.initialPopulation
                  const alert = getAlert(s)
                  return (
                    <div key={idx} className={`p-4 rounded-lg ${getRiskLevelBg(s.riskLevel)} border-l-4 ${s.riskLevel <= 2 ? 'border-red-500' : 'border-green-500'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{s.name}</h3>
                        {alert && <span className="text-xs font-bold text-red-600">{alert}</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Risk Level:</span>
                          <span className={`ml-2 font-bold ${getRiskLevelColor(s.riskLevel)}`}>
                            {s.riskLevel}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">
                            {s.isFauna ? 'Population:' : 'Biomass:'}
                          </span>
                          <span className="ml-2 font-bold">
                            {s.isFauna ? s.population : `${s.biomass}t`}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Change:</span>
                          <span className={`ml-2 font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '+' : ''}{change}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Births:</span>
                          <span className="ml-2 text-green-600 font-bold">+{s.births}</span>
                        </div>
                        <div>
                          <span className="font-medium">Deaths:</span>
                          <span className="ml-2 text-red-600 font-bold">-{s.deaths}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Relocation Priority Queue */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-orange-700 mb-4">🚨 Relocation Priority Queue</h2>
            {relocationQueue.length === 0 ? (
              <p className="text-gray-500">No species in priority queue.</p>
            ) : (
              <div className="space-y-2">
                {relocationQueue.map((name, idx) => (
                  <div key={idx} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <span className="font-medium text-orange-800">{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dependency Graph */}
        {foodChain.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">🕸️ Species Dependency Graph</h2>
            <p className="text-gray-600 mb-4">Visual representation of predator-prey relationships</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(dependencyGraph).map(([speciesName, connections]) => {
                if (connections.predators.length === 0 && connections.prey.length === 0) return null
                return (
                  <div key={speciesName} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                    <h3 className="font-bold text-lg text-blue-800 mb-2">{speciesName}</h3>
                    {connections.predators.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs font-semibold text-red-600 mb-1">Eaten by (Predators):</div>
                        <div className="space-y-1">
                          {connections.predators.map((pred, idx) => (
                            <div key={idx} className="text-sm bg-red-50 px-2 py-1 rounded border-l-2 border-red-400">
                              ↑ {pred}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {connections.prey.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-green-600 mb-1">Feeds on (Prey):</div>
                        <div className="space-y-1">
                          {connections.prey.map((preyItem, idx) => (
                            <div key={idx} className="text-sm bg-green-50 px-2 py-1 rounded border-l-2 border-green-400">
                              ↓ {preyItem}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {Object.values(dependencyGraph).every(conn => conn.predators.length === 0 && conn.prey.length === 0) && (
              <p className="text-gray-500 text-center py-4">Add food chain relationships to see the dependency graph</p>
            )}
          </div>
        )}

        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>EcoTrack uses advanced data structures (BST, Graph, Queue) to monitor biodiversity.</p>
          <p className="mt-1">Console-based Java implementation also available.</p>
        </footer>
      </div>
    </main>
  )
}
