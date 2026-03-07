import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RiskLevel, Species, EcosystemStats } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function getRiskLevelLabel(risk: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    1: 'Critical',
    2: 'Endangered',
    3: 'Vulnerable',
    4: 'Near Threatened',
    5: 'Least Concern',
  }
  return labels[risk]
}

export function getRiskLevelBadgeClass(risk: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    1: 'badge-critical',
    2: 'badge-endangered',
    3: 'badge-vulnerable',
    4: 'badge-near',
    5: 'badge-least',
  }
  return classes[risk]
}

export function getRiskLevelColor(risk: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    1: '#d97559',
    2: '#d4915a',
    3: '#c9a94e',
    4: '#6b9bc3',
    5: '#6aab7a',
  }
  return colors[risk]
}

export function getSpeciesAlert(species: Species): string | null {
  if (species.population <= 0) return 'EXTINCT'
  if (species.population < 50 && species.isFauna) return 'CRITICAL POPULATION'
  if (species.riskLevel === 1) return 'HIGHLY ENDANGERED'
  return null
}

export function calculateEcosystemStats(species: Species[]): EcosystemStats {
  return species.reduce(
    (stats, s) => ({
      totalSpecies: stats.totalSpecies + 1,
      totalPopulation: stats.totalPopulation + s.population,
      criticalSpecies: stats.criticalSpecies + (s.riskLevel === 1 ? 1 : 0),
      endangeredSpecies: stats.endangeredSpecies + (s.riskLevel <= 2 ? 1 : 0),
      totalBirths: stats.totalBirths + s.births,
      totalDeaths: stats.totalDeaths + s.deaths,
      faunaCount: stats.faunaCount + (s.isFauna ? 1 : 0),
      floraCount: stats.floraCount + (!s.isFauna ? 1 : 0),
    }),
    {
      totalSpecies: 0,
      totalPopulation: 0,
      criticalSpecies: 0,
      endangeredSpecies: 0,
      totalBirths: 0,
      totalDeaths: 0,
      faunaCount: 0,
      floraCount: 0,
    }
  )
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
