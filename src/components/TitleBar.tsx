import { Minus, Square, X } from 'lucide-react'

declare global {
  interface Window {
    electronAPI?: {
      minimize: () => void
      maximize: () => void
      close: () => void
    }
  }
}

export default function TitleBar() {
  if (typeof window === 'undefined' || !window.electronAPI) return null

  return (
    <div className="flex items-center justify-end h-9 px-3 select-none bg-black/40 backdrop-blur-sm border-b border-graphite/50">
      <button
        onClick={() => window.electronAPI?.minimize()}
        className="flex items-center justify-center w-8 h-8 text-fog hover:text-pure hover:bg-white/5 rounded-xs transition-colors"
      >
        <Minus size={14} />
      </button>
      <button
        onClick={() => window.electronAPI?.maximize()}
        className="flex items-center justify-center w-8 h-8 text-fog hover:text-pure hover:bg-white/5 rounded-xs transition-colors"
      >
        <Square size={12} />
      </button>
      <button
        onClick={() => window.electronAPI?.close()}
        className="flex items-center justify-center w-8 h-8 text-fog hover:text-red-400 hover:bg-red-500/10 rounded-xs transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}
