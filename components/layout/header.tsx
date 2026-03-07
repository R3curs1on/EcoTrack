'use client'

import { Leaf, Download, Upload, Trash2 } from 'lucide-react'
import { useEcoTrackStore } from '@/lib/store'
import { useState, useRef } from 'react'

export function Header() {
  const { exportData, importData, clearAllData, species } = useEcoTrackStore()
  const [showActions, setShowActions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ecotrack-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowActions(false)
  }
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (importData(content)) {
        setShowActions(false)
      }
    }
    reader.readAsText(file)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const handleClear = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllData()
      setShowActions(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-button">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-heading">EcoTrack</h1>
              <p className="text-xs text-muted">Biodiversity Monitoring</p>
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-heading">{species.length}</p>
              <p className="text-xs text-muted">Species</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-heading">
                {species.reduce((sum, s) => sum + s.population, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted">Total Population</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="btn-secondary text-sm"
            >
              Data Actions
            </button>
            
            {showActions && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowActions(false)} 
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-card shadow-card-hover border border-border z-20 animate-scale-in">
                  <div className="p-1">
                    <button
                      onClick={handleExport}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-body hover:bg-primary-bg rounded-button transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                    <label className="w-full flex items-center gap-3 px-3 py-2 text-sm text-body hover:bg-primary-bg rounded-button transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Import Data
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                    <div className="my-1 border-t border-border" />
                    <button
                      onClick={handleClear}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-risk-critical hover:bg-risk-critical/5 rounded-button transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All Data
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
