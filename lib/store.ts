'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Species, FoodChainRelation, SimulationResult, RiskLevel, TabId } from './types'
import { generateId } from './utils'
import { CASCADE_EFFECTS, CRITICAL_POPULATION_THRESHOLD, STORAGE_KEY } from './constants'

// Demo data for initial load
const DEMO_SPECIES: Species[] = [
  {
    id: 'demo-1',
    name: 'Gray Wolf',
    riskLevel: 2,
    population: 320,
    isFauna: true,
    biomass: 45,
    initialPopulation: 350,
    births: 45,
    deaths: 75,
    createdAt: new Date('2024-01-15'),
    populationHistory: [
      { timestamp: new Date('2024-01-15'), population: 350, event: 'initial' },
      { timestamp: new Date('2024-02-20'), population: 380, event: 'birth' },
      { timestamp: new Date('2024-04-10'), population: 340, event: 'death' },
      { timestamp: new Date('2024-06-05'), population: 320, event: 'cascade' },
    ]
  },
  {
    id: 'demo-2',
    name: 'White-tailed Deer',
    riskLevel: 5,
    population: 2500,
    isFauna: true,
    biomass: 120,
    initialPopulation: 2000,
    births: 800,
    deaths: 300,
    createdAt: new Date('2024-01-15'),
    populationHistory: [
      { timestamp: new Date('2024-01-15'), population: 2000, event: 'initial' },
      { timestamp: new Date('2024-03-10'), population: 2400, event: 'birth' },
      { timestamp: new Date('2024-05-20'), population: 2500, event: 'birth' },
    ]
  },
  {
    id: 'demo-3',
    name: 'Red Fox',
    riskLevel: 4,
    population: 890,
    isFauna: true,
    biomass: 8,
    initialPopulation: 800,
    births: 150,
    deaths: 60,
    createdAt: new Date('2024-01-15'),
    populationHistory: [
      { timestamp: new Date('2024-01-15'), population: 800, event: 'initial' },
      { timestamp: new Date('2024-04-15'), population: 890, event: 'birth' },
    ]
  },
  {
    id: 'demo-4',
    name: 'Eastern Cottontail',
    riskLevel: 5,
    population: 4200,
    isFauna: true,
    biomass: 1.5,
    initialPopulation: 3500,
    births: 1200,
    deaths: 500,
    createdAt: new Date('2024-01-15'),
    populationHistory: [
      { timestamp: new Date('2024-01-15'), population: 3500, event: 'initial' },
      { timestamp: new Date('2024-02-28'), population: 4000, event: 'birth' },
      { timestamp: new Date('2024-05-15'), population: 4200, event: 'birth' },
    ]
  },
  {
    id: 'demo-5',
    name: 'Bald Eagle',
    riskLevel: 3,
    population: 150,
    isFauna: true,
    biomass: 6,
    initialPopulation: 120,
    births: 40,
    deaths: 10,
    createdAt: new Date('2024-01-15'),
    populationHistory: [
      { timestamp: new Date('2024-01-15'), population: 120, event: 'initial' },
      { timestamp: new Date('2024-06-01'), population: 150, event: 'birth' },
    ]
  },
  {
    id: 'demo-6',
    name: 'Rainbow Trout',
    riskLevel: 4,
    population: 8500,
    isFauna: true,
    biomass: 2,
    initialPopulation: 8000,
    births: 1500,
    deaths: 1000,
    createdAt: new Date('2024-01-15'),
    populationHistory: [
      { timestamp: new Date('2024-01-15'), population: 8000, event: 'initial' },
      { timestamp: new Date('2024-04-01'), population: 8500, event: 'birth' },
    ]
  },
  {
    id: 'demo-7',
    name: 'Oak Tree',
    riskLevel: 5,
    population: 15000,
    isFauna: false,
    biomass: 500,
    initialPopulation: 14500,
    births: 600,
    deaths: 100,
    createdAt: new Date('2024-01-15'),
    populationHistory: [
      { timestamp: new Date('2024-01-15'), population: 14500, event: 'initial' },
      { timestamp: new Date('2024-05-01'), population: 15000, event: 'birth' },
    ]
  },
  {
    id: 'demo-8',
    name: 'Wild Grass',
    riskLevel: 5,
    population: 50000,
    isFauna: false,
    biomass: 0.5,
    initialPopulation: 45000,
    births: 8000,
    deaths: 3000,
    createdAt: new Date('2024-01-15'),
    populationHistory: [
      { timestamp: new Date('2024-01-15'), population: 45000, event: 'initial' },
      { timestamp: new Date('2024-03-15'), population: 50000, event: 'birth' },
    ]
  },
  {
    id: 'demo-9',
    name: 'Mountain Lion',
    riskLevel: 3,
    population: 85,
    isFauna: true,
    biomass: 60,
    initialPopulation: 100,
    births: 15,
    deaths: 30,
    createdAt: new Date('2024-01-15'),
    populationHistory: [
      { timestamp: new Date('2024-01-15'), population: 100, event: 'initial' },
      { timestamp: new Date('2024-03-20'), population: 90, event: 'death' },
      { timestamp: new Date('2024-05-10'), population: 85, event: 'death' },
    ]
  },
  {
    id: 'demo-10',
    name: 'American Black Bear',
    riskLevel: 4,
    population: 280,
    isFauna: true,
    biomass: 150,
    initialPopulation: 250,
    births: 50,
    deaths: 20,
    createdAt: new Date('2024-01-15'),
    populationHistory: [
      { timestamp: new Date('2024-01-15'), population: 250, event: 'initial' },
      { timestamp: new Date('2024-04-30'), population: 280, event: 'birth' },
    ]
  }
]

const DEMO_FOOD_CHAIN: FoodChainRelation[] = [
  { id: 'fc-1', predator: 'Gray Wolf', prey: 'White-tailed Deer', createdAt: new Date('2024-01-20') },
  { id: 'fc-2', predator: 'Gray Wolf', prey: 'Eastern Cottontail', createdAt: new Date('2024-01-20') },
  { id: 'fc-3', predator: 'Mountain Lion', prey: 'White-tailed Deer', createdAt: new Date('2024-01-20') },
  { id: 'fc-4', predator: 'Mountain Lion', prey: 'Eastern Cottontail', createdAt: new Date('2024-01-20') },
  { id: 'fc-5', predator: 'Red Fox', prey: 'Eastern Cottontail', createdAt: new Date('2024-01-20') },
  { id: 'fc-6', predator: 'Red Fox', prey: 'Rainbow Trout', createdAt: new Date('2024-01-20') },
  { id: 'fc-7', predator: 'Bald Eagle', prey: 'Rainbow Trout', createdAt: new Date('2024-01-20') },
  { id: 'fc-8', predator: 'Bald Eagle', prey: 'Eastern Cottontail', createdAt: new Date('2024-01-20') },
  { id: 'fc-9', predator: 'American Black Bear', prey: 'Rainbow Trout', createdAt: new Date('2024-01-20') },
  { id: 'fc-10', predator: 'American Black Bear', prey: 'White-tailed Deer', createdAt: new Date('2024-01-20') },
  { id: 'fc-11', predator: 'White-tailed Deer', prey: 'Wild Grass', createdAt: new Date('2024-01-20') },
  { id: 'fc-12', predator: 'White-tailed Deer', prey: 'Oak Tree', createdAt: new Date('2024-01-20') },
  { id: 'fc-13', predator: 'Eastern Cottontail', prey: 'Wild Grass', createdAt: new Date('2024-01-20') },
]

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
  loadDemoData: () => void
}

export const useEcoTrackStore = create<EcoTrackState>()(
  persist(
    (set, get) => ({
      // Initial State - with demo data
      species: DEMO_SPECIES,
      foodChain: DEMO_FOOD_CHAIN,
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

  loadDemoData: () =>
  set({
  species: DEMO_SPECIES,
  foodChain: DEMO_FOOD_CHAIN,
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
