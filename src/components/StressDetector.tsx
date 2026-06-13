import { useEffect, useRef } from 'react'
import { useWellness } from '@/context/WellnessContext'

export default function StressMonitor() {
  const { state, addTabSwitch, addIdle, addTypingSpike, startBreathing } = useWellness()
  const breathingStartedRef = useRef(false)

  useVisibilityTracking(addTabSwitch)
  useTypingSpikeDetection(addTypingSpike)
  useIdleDetection(addIdle)

  useEffect(() => {
    if (state.stress >= 60 && !state.breathingActive && !breathingStartedRef.current) {
      breathingStartedRef.current = true
      startBreathing()
    }
    if (state.breathingActive) {
      breathingStartedRef.current = false
    }
  }, [state.stress, state.breathingActive, startBreathing])

  return null
}

export function useVisibilityTracking(onTabSwitch: () => void) {
  useEffect(() => {
    const handler = () => {
      if (!document.hidden) onTabSwitch()
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [onTabSwitch])
}

export function useTypingSpikeDetection(onSpike: () => void) {
  const eventsRef = useRef<{ time: number }[]>([])

  useEffect(() => {
    const handler = () => {
      eventsRef.current.push({ time: Date.now() })
      const cutoff = Date.now() - 5000
      eventsRef.current = eventsRef.current.filter((e) => e.time > cutoff)

      if (eventsRef.current.length >= 40) {
        onSpike()
        eventsRef.current = []
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSpike])
}

export function useIdleDetection(onIdle: () => void) {
  const idleRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      idleRef.current += 10
      if (idleRef.current >= 30) {
        onIdle()
        idleRef.current = 0
      }
    }, 10000)
    const reset = () => { idleRef.current = 0 }
    window.addEventListener('mousemove', reset)
    window.addEventListener('keydown', reset)
    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', reset)
      window.removeEventListener('keydown', reset)
    }
  }, [onIdle])
}
