import { atom, computed } from 'nanostores'
import { persistentMap } from '@nanostores/persistent'
import { analyzeData } from '../services/ai'

type FileInfo = {
  id: string
  name: string
  content: string
  timestamp: number
  insights?: string
  suggestedPrompts?: string[]
}

export const $fileHistory = persistentMap<Record<string, FileInfo>>('fileHistory:', {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
})
export const $selectedFileId = atom<string | null>(null)

export const $selectedFile = computed([$fileHistory, $selectedFileId], (history, selectedId) => {
  if (!selectedId) return null
  return history[selectedId]
})

export async function addFile(file: File) {
  const content = await file.text()
  const id = crypto.randomUUID()
  
  // Store file info
  $fileHistory.setKey(id, {
    id,
    name: file.name,
    content,
    timestamp: Date.now()
  })
  
  $selectedFileId.set(id)
  
  // Generate initial insights and suggestions
  try {
    const result = await analyzeData({
      data: content,
      question: 'Analyze this dataset and provide: 1. Key insights about the data 2. Five relevant questions that could be asked about this data'
    })
    
    const [insights, ...promptSuggestions] = result.answer.split('\n\n')
    
    $fileHistory.setKey(id, {
      ...$fileHistory.get()[id],
      insights,
      suggestedPrompts: promptSuggestions
        .filter(line => line.startsWith('- ') || line.startsWith('* '))
        .map(line => line.slice(2))
    })
  } catch (error) {
    console.error('Failed to generate insights:', error)
  }
}