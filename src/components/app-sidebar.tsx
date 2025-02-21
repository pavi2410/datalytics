import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useStore } from "@nanostores/react"
import { $datasets, $selectedDatasetId, $analyses, $selectedAnalysisId } from "@/stores/datasets"
import { Link } from '@tanstack/react-router'

export function AppSidebar() {
  const datasets = useStore($datasets)
  const currentDatasetId = useStore($selectedDatasetId)
  const analyses = useStore($analyses)
  const currentAnalysisId = useStore($selectedAnalysisId)

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4">
          <Link to="/" className="hover:opacity-80">
            <h2 className="text-lg font-semibold">Datalytics</h2>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="space-y-6">
        <div>
          <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">Datasets</h3>
          <div className="space-y-2 px-2">
            {Object.values(datasets).map(dataset => (
              <div
                key={dataset.id}
                className={`p-3 rounded-lg cursor-pointer border ${dataset.id === currentDatasetId ? 'bg-accent border-accent' : 'hover:bg-accent/50'}`}
                onClick={() => $selectedDatasetId.set(dataset.id)}
              >
                <Link to="/datasets/$id" params={{ id: dataset.id }}>
                  <h4 className="font-medium">{dataset.name}</h4>
                  <p className="text-xs text-muted-foreground">{new Date(dataset.timestamp).toLocaleString()}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">Analyses</h3>
          <div className="space-y-2 px-2">
            {Object.values(analyses).map(analysis => (
              <div
                key={analysis.id}
                className={`p-3 rounded-lg cursor-pointer border ${analysis.id === currentAnalysisId ? 'bg-accent border-accent' : 'hover:bg-accent/50'}`}
                onClick={() => $selectedAnalysisId.set(analysis.id)}
              >
                <Link to="/analyses/$id" params={{ id: analysis.id }}>
                  <h4 className="font-medium">{analysis.name}</h4>
                  <p className="text-xs text-muted-foreground">{new Date(analysis.timestamp).toLocaleString()}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
