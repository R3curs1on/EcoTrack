'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useEcoTrackStore } from '@/lib/store'
import { RiskLevel } from '@/lib/types'
import { RISK_LEVELS } from '@/lib/constants'
import { getRiskLevelColor } from '@/lib/utils'

export function SpeciesForm() {
  const { addSpecies } = useEcoTrackStore()
  
  const [name, setName] = useState('')
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(3)
  const [isFauna, setIsFauna] = useState(true)
  const [measure, setMeasure] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !measure) return

    const measureNum = Number(measure)
    
    addSpecies({
      name: name.trim(),
      riskLevel,
      population: isFauna ? measureNum : 0,
      isFauna,
      biomass: isFauna ? 0 : measureNum,
      initialPopulation: isFauna ? measureNum : 0,
    })

    setName('')
    setMeasure('')
    setRiskLevel(3)
    setIsFauna(true)
  }

  return (
    <div className="card animate-slide-up">
      <h3 className="text-lg font-semibold text-heading mb-4">Add New Species</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Species Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter species name"
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">
            Risk Level: {RISK_LEVELS.find(r => r.value === riskLevel)?.label}
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={riskLevel}
            onChange={(e) => setRiskLevel(Number(e.target.value) as RiskLevel)}
            className="slider"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>Critical</span>
            <span>Least Concern</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getRiskLevelColor(riskLevel) }}
            />
            <span className="text-sm text-muted">
              {RISK_LEVELS.find(r => r.value === riskLevel)?.description}
            </span>
          </div>
        </div>

        <div>
          <label className="label">Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={isFauna}
                onChange={() => setIsFauna(true)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-sm text-body">Fauna (Animal)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={!isFauna}
                onChange={() => setIsFauna(false)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-sm text-body">Flora (Plant)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="label">{isFauna ? 'Population' : 'Biomass (tons)'}</label>
          <input
            type="number"
            value={measure}
            onChange={(e) => setMeasure(e.target.value)}
            placeholder={isFauna ? 'Enter population count' : 'Enter biomass in tons'}
            min={0}
            className="input"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          <Plus className="w-4 h-4" />
          Add Species
        </button>
      </form>
    </div>
  )
}
