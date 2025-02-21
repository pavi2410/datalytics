import { createFileRoute, Link } from '@tanstack/react-router'
import { marked } from 'marked'
import { $selectedAnalysis, $datasets } from '@/stores/datasets'
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
      
      <div className="mt-2">
        <h3 className="text-sm font-medium text-muted-foreground">Datasets used:</h3>
        <ul className="mt-1 list-disc list-inside text-sm">
          {selectedAnalysis.datasetIds.map(datasetId => {
            const dataset = $datasets.get()[datasetId];
            return dataset ? (
              <li key={datasetId} className="!list-none">
                <Link
                  to="/datasets/$id"
                  params={{ id: datasetId }}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border bg-accent hover:bg-accent/80"
                >
                  {dataset.name}
                </Link>
              </li>
            ) : null;
          })}
        </ul>
      </div>

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