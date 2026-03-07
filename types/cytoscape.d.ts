declare module 'react-cytoscapejs' {
  import cytoscape from 'cytoscape'
  import { Component, CSSProperties } from 'react'

  interface CytoscapeComponentProps {
    id?: string
    cy?: (cy: cytoscape.Core) => void
    style?: CSSProperties
    elements: cytoscape.ElementDefinition[]
    layout?: cytoscape.LayoutOptions
    stylesheet?: cytoscape.Stylesheet[]
    className?: string
    zoom?: number
    pan?: cytoscape.Position
    minZoom?: number
    maxZoom?: number
    zoomingEnabled?: boolean
    userZoomingEnabled?: boolean
    panningEnabled?: boolean
    userPanningEnabled?: boolean
    boxSelectionEnabled?: boolean
    autoungrabify?: boolean
    autounselectify?: boolean
  }

  export default class CytoscapeComponent extends Component<CytoscapeComponentProps> {}
}
