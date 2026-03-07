'use client'

import { useState } from 'react'
import { Link } from 'lucide-react'
import { useEcoTrackStore } from '@/lib/store'

export function FoodChainForm() {
  const { addFoodChainRelation, species } = useEcoTrackStore()
  
  const [predator, setPredator] = useState('')
  const [prey, setPrey] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!predator.trim() || !prey.trim()) return
    
    addFoodChainRelation(predator.trim(), prey.trim())
    setPredator('')
    setPrey('')
  }

  const speciesNames = species.map(s => s.name)

  return (
    <div className="card animate-slide-up">
      <h3 className="text-lg font-semibold text-heading mb-4">Add Food Chain Relation</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Predator</label>
          <select
            value={predator}
            onChange={(e) => setPredator(e.target.value)}
            className="select"
            required
          >
            <option value="">Select predator</option>
            {speciesNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <p className="text-xs text-muted mt-1">The species that feeds on prey</p>
        </div>

        <div className="flex justify-center py-2">
          <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center">
            <Link className="w-4 h-4 text-primary rotate-90" />
          </div>
        </div>

        <div>
          <label className="label">Prey</label>
          <select
            value={prey}
            onChange={(e) => setPrey(e.target.value)}
            className="select"
            required
          >
            <option value="">Select prey</option>
            {speciesNames.filter(n => n !== predator).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <p className="text-xs text-muted mt-1">The species that is consumed</p>
        </div>

        <button type="submit" className="btn-primary w-full">
          <Link className="w-4 h-4" />
          Add Relationship
        </button>
      </form>
    </div>
  )
}
