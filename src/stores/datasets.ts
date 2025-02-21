import { persistentMap } from '@nanostores/persistent'
import { atom, computed } from 'nanostores'
import { analyzeData } from '../services/ai'

type Dataset = {
  id: string
  name: string
  content: string
  timestamp: number
  insights?: string
  suggestedPrompts?: string[]
}

type Analysis = {
  id: string
  name: string
  datasetIds: string[]
  question: string
  result?: string
  timestamp: number
}

export const $datasets = persistentMap<Record<string, Dataset>>('datasets:', {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

export const $analyses = persistentMap<Record<string, Analysis>>('analyses:', {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

export const $selectedDatasetId = atom<string | null>(null)
export const $selectedAnalysisId = atom<string | null>(null)

export const $selectedDataset = computed([$datasets, $selectedDatasetId], (datasets, selectedId) => {
  if (!selectedId) return null
  return datasets[selectedId]
})

export const $selectedAnalysis = computed([$analyses, $selectedAnalysisId], (analyses, selectedId) => {
  if (!selectedId) return null
  return analyses[selectedId]
})

export async function addDataset(file: File) {
  const content = await file.text()
  const id = crypto.randomUUID()
  
  // Store dataset info
  $datasets.setKey(id, {
    id,
    name: file.name,
    content,
    timestamp: Date.now()
  })
  
  $selectedDatasetId.set(id)
  
  // Generate initial insights and suggestions
  try {
    const result = await analyzeData({
      data: content,
      question: 'Analyze this dataset and provide: 1. Key insights about the data 2. Five relevant questions that could be asked about this data'
    })
    
    const [insights, ...promptSuggestions] = result.answer.split('\n\n')
    
    $datasets.setKey(id, {
      ...$datasets.get()[id],
      insights,
      suggestedPrompts: promptSuggestions
        .filter(line => line.startsWith('- ') || line.startsWith('* '))
        .map(line => line.slice(2))
    })
  } catch (error) {
    console.error('Failed to generate insights:', error)
  }
}

export async function createAnalysis(name: string, datasetIds: string[], question: string) {
  const id = crypto.randomUUID()
  
  // Create analysis
  $analyses.setKey(id, {
    id,
    name,
    datasetIds,
    question,
    timestamp: Date.now()
  })
  
  $selectedAnalysisId.set(id)
  
  // Run analysis on selected datasets
  try {
    const datasets = datasetIds.map(id => $datasets.get()[id])
    const combinedData = datasets.map(d => d.content).join('\n---\n')
    
    const result = await analyzeData({
      data: combinedData,
      question
    })
    
    $analyses.setKey(id, {
      ...$analyses.get()[id],
      result: result.answer
    })
  } catch (error) {
    console.error('Analysis failed:', error)
  }
}