interface StressAnalysis {
  score: number
  label: 'calm' | 'tense' | 'stressed'
  reason: string
  windowActivity: string
}

interface ActivityData {
  title: string
  process: string
  idle: number
  switchCount: number
  totalEvents: number
}

interface UpdateStatus {
  status: 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error'
  data?: {
    version?: string
    releaseDate?: string
    percent?: number
    bytesPerSecond?: number
    total?: number
    transferred?: number
    message?: string
  }
}

interface ElectronAPI {
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  close: () => Promise<void>
  getCurrentStress: () => Promise<StressAnalysis | null>
  setLoginItem: (open: boolean) => Promise<boolean>
  getLoginItem: () => Promise<boolean>
  checkForUpdates: () => Promise<void>
  downloadUpdate: () => Promise<void>
  installUpdate: () => Promise<void>
  onStressUpdate: (cb: (analysis: StressAnalysis) => void) => () => void
  onActivityUpdate: (cb: (data: ActivityData) => void) => () => void
  onUpdateStatus: (cb: (status: UpdateStatus) => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
