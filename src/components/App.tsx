import { ReactLenis } from 'lenis/react'
import { WellnessProvider } from '@/context/WellnessContext'
import Dashboard from './Dashboard'
import ThemeToggle from './ThemeToggle'
import AuthProvider from './AuthProvider'
import TitleBar from './TitleBar'
import BreathingExercise from './BreathingExercise'
import StressMonitor from './StressDetector'

export default function App() {
  return (
    <AuthProvider>
      <WellnessProvider>
        <TitleBar />
        <StressMonitor />
        <ReactLenis root options={{ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}>
          <ThemeToggle />
          <Dashboard />
        </ReactLenis>
        <BreathingExercise />
      </WellnessProvider>
    </AuthProvider>
  )
}
