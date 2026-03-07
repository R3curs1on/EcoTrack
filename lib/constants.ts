import { Tab, RiskLevel } from './types'

export const TABS: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'species', label: 'Species', icon: 'TreePine' },
  { id: 'food-chain', label: 'Food Chain', icon: 'Link' },
  { id: 'simulation', label: 'Simulation', icon: 'FlaskConical' },
  { id: 'records', label: 'Records', icon: 'ClipboardList' },
]

export const RISK_LEVELS: { value: RiskLevel; label: string; description: string }[] = [
  { value: 1, label: 'Critical', description: 'Extremely high risk of extinction' },
  { value: 2, label: 'Endangered', description: 'High risk of extinction' },
  { value: 3, label: 'Vulnerable', description: 'At risk of becoming endangered' },
  { value: 4, label: 'Near Threatened', description: 'May become vulnerable soon' },
  { value: 5, label: 'Least Concern', description: 'Lowest level of conservation concern' },
]

export const CHART_COLORS = {
  primary: '#4a7c59',
  secondary: '#8fae98',
  tertiary: '#c9d4cb',
  accent: '#c4856a',
  grid: '#e2e8df',
  text: '#6b7d6f',
  
  // Risk colors for charts
  critical: '#d97559',
  endangered: '#d4915a',
  vulnerable: '#c9a94e',
  near: '#6b9bc3',
  least: '#6aab7a',
}

export const CASCADE_EFFECTS = {
  predatorLossRate: 0.2, // 20% loss when prey dies
  preyGainRate: 0.1, // 10% gain when predator dies
}

export const CRITICAL_POPULATION_THRESHOLD = 50

export const STORAGE_KEY = 'ecotrack-data'

export const ANIMATION_DELAYS = {
  stagger: 50,
  card: 100,
  tab: 200,
  chart: 400,
}
