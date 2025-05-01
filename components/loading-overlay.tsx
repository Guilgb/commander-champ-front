import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = "Carregando..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 max-w-md mx-auto">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-xl font-medium text-center">{message}</p>
      </div>
    </div>
  )
}