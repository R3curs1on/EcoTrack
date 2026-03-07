'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Species, FoodChainRelation, SimulationResult, RiskLevel, TabId } from './types'
import { generateId } from './utils'
import { CASCADE_EFFECTS, CRITICAL_POPULATION_THRESHOLD, STORAGE_KEY } from './constants'

interface EcoTrackState {
  // Data
  species: Species[]
  foodChain: FoodChainRelation[]
  relocationQueue: string[]
  simulationResults: SimulationResult[]
  
  // UI State
  activeTab: TabId
  searchQuery: string
  filterRiskLevel: RiskLevel | null
  showSimulationResults: boolean
  
  // Actions
  setActiveTab: (tab: TabId) => void
  setSearchQuery: (query: string) => void
  setFilterRiskLevel: (level: RiskLevel | null) => void
  
  // Species Actions
  addSpecies: (data: Omit<Species, 'id' | 'createdAt' | 'populationHistory' | 'births' | 'deaths'>) => void
  removeSpecies: (id: string) => void
  recordBirth: (speciesName: string, count: number) => void
  recordDeath: (speciesName: string, count: number) => void
  
  // Food Chain Actions
  addFoodChainRelation: (predator: string, prey: string) => void
  removeFoodChainRelation: (id: string) => void
  
  // Simulation Actions
  runSimulation: (speciesName: string, deaths: number) => void
  clearSimulation: () => void
  
  // Data Actions
  exportData: () => string
  importData: (jsonString: string) => boolean
  clearAllData: () => void
}

export const useEcoTrackStore = create<EcoTrackState>()(
  persist(
    (set, get) => ({
      // Initial State
      species: [],
      foodChain: [],
      relocationQueue: [],
      simulationResults: [],
      activeTab: 'dashboard',
      searchQuery: '',
      filterRiskLevel: null,
      showSimulationResults: false,
      
      // UI Actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterRiskLevel: (level) => set({ filterRiskLevel: level }),
      
      // Species Actions
      addSpecies: (data) => {
        const newSpecies: Species = {
          ...data,
          id: generateId(),
          createdAt: new Date(),
          births: 0,
          deaths: 0,
          populationHistory: [
            {
              timestamp: new Date(),
              population: data.population,
              event: 'initial',
            },
          ],
        }
        
        set((state) => {
          const updatedSpecies = [...state.species, newSpecies]
          const updatedQueue =
            data.riskLevel <= 2
              ? [...state.relocationQueue, data.name]
              : state.relocationQueue
          
          return {
            species: updatedSpecies,
            relocationQueue: updatedQueue,
          }
        })
      },
      
      removeSpecies: (id) =>
        set((state) => {
          const speciesName = state.species.find((s) => s.id === id)?.name
          return {
            species: state.species.filter((s) => s.id !== id),
            relocationQueue: speciesName
              ? state.relocationQueue.filter((n) => n !== speciesName)
              : state.relocationQueue,
            foodChain: speciesName
              ? state.foodChain.filter(
                  (r) => r.predator !== speciesName && r.prey !== speciesName
                )
              : state.foodChain,
          }
        }),
      
      recordBirth: (speciesName, count) =>
        set((state) => {
          const updatedSpecies = state.species.map((s) => {
            if (s.name === speciesName) {
              const newPopulation = s.population + count
              return {
                ...s,
                population: newPopulation,
                births: s.births + count,
                populationHistory: [
                  ...s.populationHistory,
                  {
                    timestamp: new Date(),
                    population: newPopulation,
                    event: 'birth' as const,
                  },
                ],
              }
            }
            return s
          })
          
          // Check if species should be removed from relocation queue
          const updatedQueue = state.relocationQueue.filter((name) => {
            const species = updatedSpecies.find((s) => s.name === name)
            return species && species.population < CRITICAL_POPULATION_THRESHOLD
          })
          
          return {
            species: updatedSpecies,
            relocationQueue: updatedQueue,
          }
        }),
      
      recordDeath: (speciesName, count) =>
        set((state) => {
          const { foodChain } = state
          
          // Find affected species
          const affectedPredators = foodChain
            .filter((r) => r.prey === speciesName)
            .map((r) => r.predator)
          const affectedPrey = foodChain
            .filter((r) => r.predator === speciesName)
            .map((r) => r.prey)
          
          const updatedSpecies = state.species.map((s) => {
            // Direct death
            if (s.name === speciesName) {
              const newPopulation = Math.max(0, s.population - count)
              return {
                ...s,
                population: newPopulation,
                deaths: s.deaths + count,
                populationHistory: [
                  ...s.populationHistory,
                  {
                    timestamp: new Date(),
                    population: newPopulation,
                    event: 'death' as const,
                  },
                ],
              }
            }
            
            // Cascade effect on predators (lose population)
            if (affectedPredators.includes(s.name)) {
              const impact = Math.floor(count * CASCADE_EFFECTS.predatorLossRate)
              const newPopulation = Math.max(0, s.population - impact)
              return {
                ...s,
                population: newPopulation,
                populationHistory: [
                  ...s.populationHistory,
                  {
                    timestamp: new Date(),
                    population: newPopulation,
                    event: 'cascade' as const,
                  },
                ],
              }
            }
            
            // Cascade effect on prey (gain population)
            if (affectedPrey.includes(s.name)) {
              const impact = Math.floor(count * CASCADE_EFFECTS.preyGainRate)
              const newPopulation = s.population + impact
              return {
                ...s,
                population: newPopulation,
                populationHistory: [
                  ...s.populationHistory,
                  {
                    timestamp: new Date(),
                    population: newPopulation,
                    event: 'cascade' as const,
                  },
                ],
              }
            }
            
            return s
          })
          
          return { species: updatedSpecies }
        }),
      
      // Food Chain Actions
      addFoodChainRelation: (predator, prey) =>
        set((state) => ({
          foodChain: [
            ...state.foodChain,
            {
              id: generateId(),
              predator,
              prey,
              createdAt: new Date(),
            },
          ],
        })),
      
      removeFoodChainRelation: (id) =>
        set((state) => ({
          foodChain: state.foodChain.filter((r) => r.id !== id),
        })),
      
      // Simulation Actions
      runSimulation: (speciesName, deaths) => {
        const { foodChain } = get()
        const results: SimulationResult[] = []
        
        const affectedPredators = foodChain
          .filter((r) => r.prey === speciesName)
          .map((r) => r.predator)
        const affectedPrey = foodChain
          .filter((r) => r.predator === speciesName)
          .map((r) => r.prey)
        
        affectedPredators.forEach((predator) => {
          const impact = Math.floor(deaths * CASCADE_EFFECTS.predatorLossRate)
          results.push({
            species: predator,
            impact: -impact,
            reason: `Predator loses food source (${speciesName})`,
          })
        })
        
        affectedPrey.forEach((prey) => {
          const impact = Math.floor(deaths * CASCADE_EFFECTS.preyGainRate)
          results.push({
            species: prey,
            impact: impact,
            reason: `Prey population increases due to reduced predation`,
          })
        })
        
        set({
          simulationResults: results,
          showSimulationResults: true,
        })
      },
      
      clearSimulation: () =>
        set({
          simulationResults: [],
          showSimulationResults: false,
        }),
      
      // Data Actions
      exportData: () => {
        const { species, foodChain, relocationQueue } = get()
        return JSON.stringify({ species, foodChain, relocationQueue }, null, 2)
      },
      
      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString)
          if (data.species && data.foodChain) {
            set({
              species: data.species,
              foodChain: data.foodChain,
              relocationQueue: data.relocationQueue || [],
            })
            return true
          }
          return false
        } catch {
          return false
        }
      },
      
      clearAllData: () =>
        set({
          species: [],
          foodChain: [],
          relocationQueue: [],
          simulationResults: [],
          showSimulationResults: false,
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        species: state.species,
        foodChain: state.foodChain,
        relocationQueue: state.relocationQueue,
      }),
    }
  )
)
