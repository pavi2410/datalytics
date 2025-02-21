import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { marked } from 'marked'
import { $selectedDataset, $selectedAnalysis, createAnalysis, $selectedDatasetId } from '@/stores/datasets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@nanostores/react'

export const Route = createFileRoute('/datasets/$id')({ 
  component: DatasetComponent,
  loader: ({ params }) => {
    $selectedDatasetId.set(params.id)
    return null
  }
})

function DatasetComponent() {
  const [analysisName, setAnalysisName] = useState('')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedDataset = useStore($selectedDataset)
  const selectedAnalysis = useStore($selectedAnalysis)

  const handleAnalysis = async () => {
    if (!selectedDataset || !question || !analysisName) return

    try {
      setLoading(true)
      await createAnalysis(analysisName, [selectedDataset.id], question)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Failed to analyze data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!selectedDataset) {
    return <div>Dataset not found</div>
  }

  return (
    <div className="container py-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium">Dataset: {selectedDataset.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create a new analysis using this dataset</p>
            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={analysisName}
                  onChange={(e) => setAnalysisName(e.target.value)}
                  placeholder="Analysis name"
                />
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What's the average value? Show me trends over time"
                />
                <Button
                  onClick={handleAnalysis}
                  disabled={loading || !question || !analysisName}
                >
                  {loading ? 'Creating...' : 'Create Analysis'}
                </Button>
              </div>

              <div className="space-y-4">
                {selectedDataset.insights && (
                  <div className="p-4 rounded-lg border bg-accent">
                    <h3 className="text-md font-medium mb-2">Dataset Insights</h3>
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: marked(selectedDataset.insights) }}
                    />
                  </div>
                )}
                {selectedDataset.suggestedPrompts && (
                  <div className="p-4 rounded-lg border bg-accent">
                    <h3 className="text-md font-medium mb-2">Suggested Questions</h3>
                    <div className="space-y-2 divide-y max-h-[200px] overflow-y-auto pr-2">
                      {selectedDataset.suggestedPrompts.map((prompt, index) => (
                        <div
                          key={index}
                          className="w-full justify-start text-left"
                          onClick={() => setQuestion(prompt)}
                          dangerouslySetInnerHTML={{ __html: marked(prompt) }}
                        >
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedAnalysis && (
                  <div className="p-4 rounded-lg border bg-accent">
                    <h3 className="text-md font-medium mb-2">Analysis Results</h3>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: marked(selectedAnalysis.result || '') }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}