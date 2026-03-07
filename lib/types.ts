export interface Species {
  id: string
  name: string
  riskLevel: RiskLevel
  population: number
  isFauna: boolean
  biomass: number
  initialPopulation: number
  births: number
  deaths: number
  createdAt: Date
  populationHistory: PopulationRecord[]
}

export interface PopulationRecord {
  timestamp: Date
  population: number
  event: 'birth' | 'death' | 'initial' | 'cascade'
}

export interface FoodChainRelation {
  id: string
  predator: string
  prey: string
  createdAt: Date
}

export interface SimulationResult {
  species: string
  impact: number
  reason: string
}

export type RiskLevel = 1 | 2 | 3 | 4 | 5

export interface DependencyGraph {
  [speciesName: string]: {
    predators: string[]
    prey: string[]
  }
}

export interface EcosystemStats {
  totalSpecies: number
  totalPopulation: number
  criticalSpecies: number
  endangeredSpecies: number
  totalBirths: number
  totalDeaths: number
  faunaCount: number
  floraCount: number
}

export type TabId = 'dashboard' | 'species' | 'food-chain' | 'simulation' | 'records'

export interface Tab {
  id: TabId
  label: string
  icon: string
}
