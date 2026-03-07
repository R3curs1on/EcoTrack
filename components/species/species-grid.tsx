'use client'

import { useEcoTrackStore } from '@/lib/store'
import { SpeciesCard } from './species-card'
import { EmptyState } from '@/components/shared/empty-state'
import { SearchInput } from '@/components/shared/search-input'
import { FilterPills } from '@/components/shared/filter-pills'
import { TreePine } from 'lucide-react'
import { useMemo } from 'react'
import { ANIMATION_DELAYS } from '@/lib/constants'

export function SpeciesGrid() {
  const { species, searchQuery, setSearchQuery, filterRiskLevel, setFilterRiskLevel } = useEcoTrackStore()

  const filteredSpecies = useMemo(() => {
    let filtered = [...species]
    
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (filterRiskLevel !== null) {
      filtered = filtered.filter(s => s.riskLevel === filterRiskLevel)
    }
    
    return filtered.sort((a, b) => a.riskLevel - b.riskLevel)
  }, [species, searchQuery, filterRiskLevel])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search species..."
          className="sm:w-64"
        />
        <FilterPills
          selected={filterRiskLevel}
          onChange={setFilterRiskLevel}
        />
      </div>

      {filteredSpecies.length === 0 ? (
        <EmptyState
          icon={<TreePine className="w-10 h-10 text-primary-muted" />}
          title={species.length === 0 ? 'No species added yet' : 'No matching species'}
          description={
            species.length === 0
              ? 'Add your first species to start tracking biodiversity in your ecosystem.'
              : 'Try adjusting your search or filters to find what you\'re looking for.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSpecies.map((species, index) => (
            <SpeciesCard
              key={species.id}
              species={species}
              delay={index * ANIMATION_DELAYS.stagger}
            />
          ))}
        </div>
      )}
    </div>
  )
}
