import { createFileRoute } from '@tanstack/react-router'
import { marked } from 'marked'
import { $selectedAnalysis } from '@/stores/datasets'
import { useStore } from '@nanostores/react'

export const Route = createFileRoute('/analyses/$id')({
  component: AnalysisComponent,
})

function AnalysisComponent() {
  const selectedAnalysis = useStore($selectedAnalysis)

  if (!selectedAnalysis) {
    return <div>Analysis not found</div>
  }

  return (
    <div className="container">
      <h2 className="text-lg font-medium">Analysis: {selectedAnalysis.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">Question: <span dangerouslySetInnerHTML={{ __html: marked(selectedAnalysis.question) }} /></p>

      <div className="mt-4 space-y-4">
        <div className="p-4 rounded-lg border bg-accent">
          <h3 className="text-md font-medium mb-2">Analysis Results</h3>
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: marked(selectedAnalysis.result || '') }}
          />
        </div>
      </div>
    </div>
  )
}