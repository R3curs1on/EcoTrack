declare module 'react-cytoscapejs' {
  import { ReactNode } from 'react'
  import type cytoscape from 'cytoscape'

  interface CytoscapeProps {
    elements: cytoscape.ElementDefinition[]
    style?: cytoscape.Stylesheet[]
    layout?: cytoscape.LayoutOptions
    stylesheet?: cytoscape.Stylesheet[]
    cy?: (cy: cytoscape.Core) => void
    minZoom?: number
    maxZoom?: number
    userZoomingEnabled?: boolean
    userPanningEnabled?: boolean
    boxSelectionEnabled?: boolean
    [key: string]: any
  }

  const CytoscapeComponent: React.FC<CytoscapeProps>
  export default CytoscapeComponent
}
