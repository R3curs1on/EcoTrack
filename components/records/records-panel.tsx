'use client'

import { useState } from 'react'
import { Heart, Skull, AlertTriangle, ClipboardList } from 'lucide-react'
import { useEcoTrackStore } from '@/lib/store'
import { EmptyState } from '@/components/shared/empty-state'

export function RecordsPanel() {
  const { species, recordBirth, recordDeath, relocationQueue } = useEcoTrackStore()
  
  const [birthSpecies, setBirthSpecies] = useState('')
  const [birthCount, setBirthCount] = useState('')
  const [deathSpecies, setDeathSpecies] = useState('')
  const [deathCount, setDeathCount] = useState('')

  const handleBirth = (e: React.FormEvent) => {
    e.preventDefault()
    if (!birthSpecies || !birthCount) return
    
    recordBirth(birthSpecies, Number(birthCount))
    setBirthSpecies('')
    setBirthCount('')
  }

  const handleDeath = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deathSpecies || !deathCount) return
    
    recordDeath(deathSpecies, Number(deathCount))
    setDeathSpecies('')
    setDeathCount('')
  }

  if (species.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="w-10 h-10 text-primary-muted" />}
        title="No species to record"
        description="Add some species first to record births and deaths."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Birth Recording */}
        <div className="card animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-risk-least/10 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-risk-least" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-heading">Record Births</h3>
              <p className="text-sm text-muted">Add new births to a species</p>
            </div>
          </div>
          
          <form onSubmit={handleBirth} className="space-y-4">
            <div>
              <label className="label">Species</label>
              <select
                value={birthSpecies}
                onChange={(e) => setBirthSpecies(e.target.value)}
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
              <label className="label">Number of Births</label>
              <input
                type="number"
                value={birthCount}
                onChange={(e) => setBirthCount(e.target.value)}
                placeholder="Enter birth count"
                min={0}
                className="input"
                required
              />
            </div>
            
            <button type="submit" className="btn-primary w-full bg-risk-least hover:bg-risk-least/90">
              <Heart className="w-4 h-4" />
              Record Births
            </button>
          </form>
        </div>

        {/* Death Recording */}
        <div className="card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-risk-critical/10 rounded-xl flex items-center justify-center">
              <Skull className="w-5 h-5 text-risk-critical" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-heading">Record Deaths</h3>
              <p className="text-sm text-muted">Record deaths with cascade effects</p>
            </div>
          </div>
          
          <form onSubmit={handleDeath} className="space-y-4">
            <div>
              <label className="label">Species</label>
              <select
                value={deathSpecies}
                onChange={(e) => setDeathSpecies(e.target.value)}
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
              <label className="label">Number of Deaths</label>
              <input
                type="number"
                value={deathCount}
                onChange={(e) => setDeathCount(e.target.value)}
                placeholder="Enter death count"
                min={0}
                className="input"
                required
              />
            </div>
            
            <button type="submit" className="btn-danger w-full">
              <Skull className="w-4 h-4" />
              Record Deaths
            </button>
          </form>
        </div>
      </div>

      {/* Relocation Priority Queue */}
      <div className="card animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-risk-endangered/10 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-risk-endangered" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-heading">Relocation Priority Queue</h3>
            <p className="text-sm text-muted">Species requiring urgent conservation attention</p>
          </div>
        </div>
        
        {relocationQueue.length === 0 ? (
          <div className="p-6 bg-background rounded-card text-center">
            <p className="text-muted">No species currently in the priority queue.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {relocationQueue.map((name, idx) => (
              <div 
                key={name} 
                className="flex items-center gap-3 p-3 bg-risk-endangered/5 rounded-button border-l-4 border-risk-endangered animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <span className="w-6 h-6 bg-risk-endangered text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <span className="font-medium text-heading">{name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
