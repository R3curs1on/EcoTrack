'use client'

import { useState } from 'react'

interface Species {
  name: string
  riskLevel: number
  population: number
  isFauna: boolean
  biomass: number
  initialPopulation: number
}

interface FoodChainRelation {
  predator: string
  prey: string
}

export default function Home() {
  const [species, setSpecies] = useState<Species[]>([])
  const [foodChain, setFoodChain] = useState<FoodChainRelation[]>([])
  const [relocationQueue, setRelocationQueue] = useState<string[]>([])
  
  // Form states
  const [speciesName, setSpeciesName] = useState('')
  const [riskLevel, setRiskLevel] = useState(3)
  const [isFauna, setIsFauna] = useState(true)
  const [measure, setMeasure] = useState(0)
  const [predator, setPredator] = useState('')
  const [prey, setPrey] = useState('')
  const [deathSpecies, setDeathSpecies] = useState('')
  const [deathCount, setDeathCount] = useState(0)
  const [recoverySpecies, setRecoverySpecies] = useState('')
  const [recoveryAmount, setRecoveryAmount] = useState(0)

  const addSpecies = (e: React.FormEvent) => {
    e.preventDefault()
    if (!speciesName.trim()) return

    const newSpecies: Species = {
      name: speciesName,
      riskLevel,
      population: isFauna ? measure : 0,
      isFauna,
      biomass: isFauna ? 0 : measure,
      initialPopulation: isFauna ? measure : 0
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
        return { ...s, population: newPopulation }
      }
      return s
    }))

    setDeathSpecies('')
    setDeathCount(0)
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
            <h2 className="text-2xl font-bold text-green-700 mb-4">🌱 Simulate Species Recovery</h2>
            <form onSubmit={simulateRecovery} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Species Name</label>
                <select
                  value={recoverySpecies}
                  onChange={(e) => setRecoverySpecies(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Recovery Amount</label>
                <input
                  type="number"
                  value={recoveryAmount}
                  onChange={(e) => setRecoveryAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Simulate Recovery
              </button>
            </form>
          </div>
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

        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>EcoTrack uses advanced data structures (BST, Graph, Queue) to monitor biodiversity.</p>
          <p className="mt-1">Console-based Java implementation also available.</p>
        </footer>
      </div>
    </main>
  )
}
