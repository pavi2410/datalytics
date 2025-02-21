import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useStore } from "@nanostores/react"
import { $datasets, $selectedDatasetId, $analyses, $selectedAnalysisId } from "@/stores/datasets"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { Link } from '@tanstack/react-router'

export function AppSidebar() {
  const datasets = useStore($datasets)
  const currentDatasetId = useStore($selectedDatasetId)
  const analyses = useStore($analyses)
  const currentAnalysisId = useStore($selectedAnalysisId)

  const handleUploadClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.xlsx,.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const event = new Event('change', { bubbles: true })
        Object.defineProperty(event, 'target', { value: { files: [file] } })
        document.querySelector('input[type="file"]')?.dispatchEvent(event)
      }
    }
    input.click()
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-semibold">Datalytics</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUploadClick}
            className="shrink-0"
            title="Upload Dataset"
          >
            <Upload className="h-4 w-4" />
          </Button>
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
