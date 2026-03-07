'use client'

import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type cytoscape from 'cytoscape'
import { useEcoTrackStore } from '@/lib/store'
import { CHART_COLORS } from '@/lib/constants'
import { Play, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const CytoscapeComponent = dynamic(() => import('react-cytoscapejs'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-background rounded-card flex items-center justify-center">
      <div className="animate-pulse text-muted">Loading graph...</div>
    </div>
  )
})

interface SimulationState {
  isRunning: boolean
  affectedNodes: Set<string>
  impactType: Map<string, 'positive' | 'negative'>
}

export function FoodChainGraph() {
  const { species, foodChain } = useEcoTrackStore()
  const cyRef = useRef<cytoscape.Core | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    affectedNodes: new Set(),
    impactType: new Map()
  })
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)

  // Build graph elements
  const elements = useMemo(() => {
    const nodes = species.map(s => ({
      data: {
        id: s.name,
        label: s.name,
        population: s.population,
        riskLevel: s.riskLevel,
        isFauna: s.isFauna,
        type: 'species'
      }
    }))

    const edges = foodChain.map(relation => ({
      data: {
        id: relation.id,
        source: relation.predator,
        target: relation.prey,
        label: 'eats'
      }
    }))

    return [...nodes, ...edges]
  }, [species, foodChain])

  // Get node color based on risk level
  const getNodeColor = useCallback((riskLevel: number, isFauna: boolean) => {
    if (!isFauna) return CHART_COLORS.primary
    switch (riskLevel) {
      case 1: return CHART_COLORS.critical
      case 2: return CHART_COLORS.endangered
      case 3: return CHART_COLORS.vulnerable
      case 4: return CHART_COLORS.near
      case 5: return CHART_COLORS.least
      default: return CHART_COLORS.secondary
    }
  }, [])

  // Cytoscape stylesheet - memoized without dependencies that change
  const stylesheet: cytoscape.Stylesheet[] = useMemo(() => [
    {
      selector: 'node',
      style: {
        'background-color': (ele: cytoscape.NodeSingular) => {
          const data = ele.data()
          if (!data.isFauna) return CHART_COLORS.primary
          switch (data.riskLevel) {
            case 1: return CHART_COLORS.critical
            case 2: return CHART_COLORS.endangered
            case 3: return CHART_COLORS.vulnerable
            case 4: return CHART_COLORS.near
            case 5: return CHART_COLORS.least
            default: return CHART_COLORS.secondary
          }
        },
        'label': 'data(label)',
        'color': '#3d4f42',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'font-size': '12px',
        'font-family': 'Plus Jakarta Sans, sans-serif',
        'font-weight': 500,
        'text-margin-y': 8,
        'width': (ele: cytoscape.NodeSingular) => {
          const pop = ele.data('population') || 100
          return Math.max(40, Math.min(80, 30 + Math.log(pop) * 8))
        },
        'height': (ele: cytoscape.NodeSingular) => {
          const pop = ele.data('population') || 100
          return Math.max(40, Math.min(80, 30 + Math.log(pop) * 8))
        },
        'border-width': 3,
        'border-color': '#ffffff',
        'transition-property': 'background-color, border-color, width, height, opacity',
        'transition-duration': 300,
        'transition-timing-function': 'ease-out'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': 4,
        'border-color': CHART_COLORS.primary,
        'background-opacity': 1
      }
    },
    {
      selector: 'node.highlighted',
      style: {
        'border-width': 4,
        'border-color': CHART_COLORS.primary,
        'z-index': 999
      }
    },
    {
      selector: 'node.simulation-source',
      style: {
        'background-color': '#ef4444',
        'border-color': '#ef4444',
        'border-width': 5
      }
    },
    {
      selector: 'node.simulation-negative',
      style: {
        'background-color': CHART_COLORS.critical,
        'border-color': '#fca5a5',
        'border-width': 4
      }
    },
    {
      selector: 'node.simulation-positive',
      style: {
        'background-color': CHART_COLORS.least,
        'border-color': '#86efac',
        'border-width': 4
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#c9d4cb',
        'target-arrow-color': '#8fae98',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'arrow-scale': 1.2,
        'opacity': 0.7,
        'transition-property': 'line-color, target-arrow-color, width, opacity',
        'transition-duration': 300
      }
    },
    {
      selector: 'edge:selected',
      style: {
        'line-color': CHART_COLORS.primary,
        'target-arrow-color': CHART_COLORS.primary,
        'width': 3,
        'opacity': 1
      }
    },
    {
      selector: 'edge.highlighted',
      style: {
        'line-color': CHART_COLORS.primary,
        'target-arrow-color': CHART_COLORS.primary,
        'width': 3,
        'opacity': 1,
        'z-index': 999
      }
    },
    {
      selector: 'edge.simulation-active',
      style: {
        'line-color': '#f59e0b',
        'target-arrow-color': '#f59e0b',
        'width': 4,
        'opacity': 1
      }
    },
    {
      selector: 'node.dimmed',
      style: {
        'opacity': 0.3
      }
    },
    {
      selector: 'edge.dimmed',
      style: {
        'opacity': 0.15
      }
    }
  ], [])

  // Layout configuration - stable reference
  const layout = useMemo(() => ({
    name: 'cose' as const,
    animate: true,
    animationDuration: 800,
    animationEasing: 'ease-out' as const,
    refresh: 20,
    fit: true,
    padding: 50,
    nodeRepulsion: () => 8000,
    nodeOverlap: 20,
    idealEdgeLength: () => 100,
    edgeElasticity: () => 100,
    nestingFactor: 1.2,
    gravity: 0.25,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  }), [])

  // Handle node selection change - update highlighting without re-initializing cy
  useEffect(() => {
    const cy = cyRef.current
    if (!cy || !isInitializedRef.current) return

    cy.elements().removeClass('highlighted dimmed')
    
    if (selectedNode) {
      const node = cy.getElementById(selectedNode)
      if (node && node.length > 0) {
        const neighborhood = node.neighborhood().add(node)
        neighborhood.addClass('highlighted')
        cy.elements().not(neighborhood).addClass('dimmed')
      }
    }
  }, [selectedNode])

  // Initialize cytoscape instance - only once
  const handleCy = useCallback((cy: cytoscape.Core) => {
    if (isInitializedRef.current && cyRef.current === cy) return
    
    cyRef.current = cy
    isInitializedRef.current = true
    
    // Remove any existing listeners first
    cy.removeAllListeners()
    
    // Node click handler
    cy.on('tap', 'node', (evt) => {
      const node = evt.target
      const nodeId = node.id()
      
      setSelectedNode(prev => prev === nodeId ? null : nodeId)
    })
    
    // Background click to clear selection
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null)
      }
    })
  }, [])

  // Run cascade simulation with animation
  const runCascadeSimulation = useCallback(() => {
    if (!selectedNode || !cyRef.current) return
    
    const cy = cyRef.current
    const sourceNode = cy.getElementById(selectedNode)
    
    if (!sourceNode || sourceNode.length === 0) return
    
    // Clear any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current)
      animationRef.current = null
    }
    
    // Reset previous simulation
    cy.elements().removeClass('simulation-source simulation-negative simulation-positive simulation-active highlighted dimmed')
    
    setSimulation({
      isRunning: true,
      affectedNodes: new Set([selectedNode]),
      impactType: new Map()
    })
    
    // Mark source node
    sourceNode.addClass('simulation-source')
    
    // Find predators (will be negatively affected - lose food source)
    const incomingEdges = sourceNode.incomers('edge')
    const predators = incomingEdges.sources()
    
    // Find prey (will be positively affected - reduced predation)
    const outgoingEdges = sourceNode.outgoers('edge')
    const prey = outgoingEdges.targets()
    
    // Dim unrelated elements
    const relatedElements = sourceNode.union(predators).union(prey).union(incomingEdges).union(outgoingEdges)
    cy.elements().not(relatedElements).addClass('dimmed')
    
    // Animate edges first, then nodes
    let step = 0
    
    const animate = () => {
      step++
      
      if (step === 1) {
        // Animate edges
        incomingEdges.addClass('simulation-active')
        outgoingEdges.addClass('simulation-active')
        animationRef.current = setTimeout(animate, 600)
      } else if (step === 2) {
        // Animate predators (negative impact)
        predators.forEach((node: cytoscape.NodeSingular) => {
          node.addClass('simulation-negative')
        })
        // Animate prey (positive impact)
        prey.forEach((node: cytoscape.NodeSingular) => {
          node.addClass('simulation-positive')
        })
        
        // Update state
        const newAffected = new Set<string>([selectedNode])
        const newImpactType = new Map<string, 'positive' | 'negative'>()
        
        predators.forEach((node: cytoscape.NodeSingular) => {
          newAffected.add(node.id())
          newImpactType.set(node.id(), 'negative')
        })
        prey.forEach((node: cytoscape.NodeSingular) => {
          newAffected.add(node.id())
          newImpactType.set(node.id(), 'positive')
        })
        
        setSimulation(prev => ({
          ...prev,
          affectedNodes: newAffected,
          impactType: newImpactType
        }))
        // No more animation steps needed
      }
    }
    
    animationRef.current = setTimeout(animate, 100)
  }, [selectedNode])

  // Reset simulation
  const resetSimulation = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current)
      animationRef.current = null
    }
    
    if (cyRef.current) {
      cyRef.current.elements().removeClass(
        'simulation-source simulation-negative simulation-positive simulation-active highlighted dimmed'
      )
    }
    
    setSimulation({
      isRunning: false,
      affectedNodes: new Set(),
      impactType: new Map()
    })
    setSelectedNode(null)
  }, [])

  // Zoom controls
  const zoomIn = useCallback(() => {
    cyRef.current?.zoom(cyRef.current.zoom() * 1.2)
  }, [])
  
  const zoomOut = useCallback(() => {
    cyRef.current?.zoom(cyRef.current.zoom() / 1.2)
  }, [])
  
  const fitGraph = useCallback(() => {
    cyRef.current?.fit(undefined, 50)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  // Get selected species info
  const selectedSpeciesInfo = useMemo(() => {
    if (!selectedNode) return null
    return species.find(s => s.name === selectedNode)
  }, [selectedNode, species])

  if (elements.length === 0 || species.length === 0) {
    return null
  }

  return (
    <div className="card animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-heading">Interactive Food Web</h3>
          <p className="text-sm text-muted mt-0.5">Click a node to see connections, then simulate cascade effects</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={zoomOut}
              className="p-1.5 text-muted hover:text-body hover:bg-background rounded-lg transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={zoomIn}
              className="p-1.5 text-muted hover:text-body hover:bg-background rounded-lg transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={fitGraph}
              className="p-1.5 text-muted hover:text-body hover:bg-background rounded-lg transition-colors"
              title="Fit to view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Simulation controls */}
          {selectedNode && !simulation.isRunning && (
            <button
              onClick={runCascadeSimulation}
              className="btn-primary text-sm py-1.5 px-3"
            >
              <Play className="w-4 h-4" />
              Simulate Impact
            </button>
          )}
          
          {simulation.isRunning && (
            <button
              onClick={resetSimulation}
              className="btn-secondary text-sm py-1.5 px-3"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.critical }} />
          <span className="text-muted">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.endangered }} />
          <span className="text-muted">Endangered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.vulnerable }} />
          <span className="text-muted">Vulnerable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.least }} />
          <span className="text-muted">Least Concern</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.primary }} />
          <span className="text-muted">Flora</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <svg width="24" height="12" className="text-muted">
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="currentColor" />
              </marker>
            </defs>
            <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </svg>
          <span className="text-muted">Eats / Consumes</span>
        </div>
      </div>
      
      {/* Graph container */}
      <div className="relative bg-background rounded-card overflow-hidden border border-border">
        <CytoscapeComponent
          elements={elements}
          style={{ width: '100%', height: '500px' }}
          stylesheet={stylesheet}
          layout={layout}
          cy={handleCy}
          minZoom={0.3}
          maxZoom={2.5}
          userZoomingEnabled={true}
          userPanningEnabled={true}
          boxSelectionEnabled={false}
        />
        
        {/* Selected node info panel */}
        {selectedSpeciesInfo && (
          <div className="absolute bottom-4 left-4 bg-surface/95 backdrop-blur-sm rounded-card p-4 shadow-soft border border-border animate-fade-in max-w-xs">
            <h4 className="font-semibold text-heading">{selectedSpeciesInfo.name}</h4>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Population:</span>
                <span className="font-medium text-body">{selectedSpeciesInfo.population.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Type:</span>
                <span className="font-medium text-body">{selectedSpeciesInfo.isFauna ? 'Fauna' : 'Flora'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Risk Level:</span>
                <span className={cn(
                  'font-medium px-2 py-0.5 rounded text-xs',
                  selectedSpeciesInfo.riskLevel === 1 && 'bg-risk-critical/10 text-risk-critical',
                  selectedSpeciesInfo.riskLevel === 2 && 'bg-risk-endangered/10 text-risk-endangered',
                  selectedSpeciesInfo.riskLevel === 3 && 'bg-risk-vulnerable/10 text-risk-vulnerable',
                  selectedSpeciesInfo.riskLevel === 4 && 'bg-risk-near/10 text-risk-near',
                  selectedSpeciesInfo.riskLevel === 5 && 'bg-risk-least/10 text-risk-least'
                )}>
                  {selectedSpeciesInfo.riskLevel === 1 && 'Critical'}
                  {selectedSpeciesInfo.riskLevel === 2 && 'Endangered'}
                  {selectedSpeciesInfo.riskLevel === 3 && 'Vulnerable'}
                  {selectedSpeciesInfo.riskLevel === 4 && 'Near Threatened'}
                  {selectedSpeciesInfo.riskLevel === 5 && 'Least Concern'}
                </span>
              </div>
            </div>
            {!simulation.isRunning && (
              <p className="text-xs text-muted mt-3">Click &quot;Simulate Impact&quot; to see cascade effects</p>
            )}
          </div>
        )}
        
        {/* Simulation results panel */}
        {simulation.isRunning && simulation.affectedNodes.size > 1 && (
          <div className="absolute bottom-4 right-4 bg-surface/95 backdrop-blur-sm rounded-card p-4 shadow-soft border border-border animate-fade-in max-w-xs">
            <h4 className="font-semibold text-heading mb-2">Cascade Impact</h4>
            <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
              {Array.from(simulation.impactType.entries()).map(([nodeId, type]) => (
                <div 
                  key={nodeId}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded',
                    type === 'negative' ? 'bg-risk-critical/10' : 'bg-risk-least/10'
                  )}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    type === 'negative' ? 'bg-risk-critical' : 'bg-risk-least'
                  )} />
                  <span className="font-medium text-body">{nodeId}</span>
                  <span className={cn(
                    'ml-auto text-xs',
                    type === 'negative' ? 'text-risk-critical' : 'text-risk-least'
                  )}>
                    {type === 'negative' ? 'Food source lost' : 'Predation reduced'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
