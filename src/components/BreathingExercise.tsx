import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind, X } from 'lucide-react'
import { useWellness } from '@/context/WellnessContext'

type Phase = 'inhale' | 'hold' | 'exhale'

const PHASE_DURATION: Record<Phase, number> = {
  inhale: 4000,
  hold: 2000,
  exhale: 6000,
}

const PHASE_LABEL: Record<Phase, string> = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
}

const PHASE_MESSAGE: Record<Phase, string> = {
  inhale: 'Slowly fill your lungs with air through your nose.',
  hold: 'Pause. Feel the calm spreading through your body.',
  exhale: 'Gently release all tension through your mouth.',
}

const PHASE_ORDER: Phase[] = ['inhale', 'hold', 'exhale']

export default function BreathingExercise() {
  const { state, stopBreathing } = useWellness()
  const [phase, setPhase] = useState<Phase>('inhale')
  const [cycles, setCycles] = useState(0)
  const activeRef = useRef(false)

  useEffect(() => {
    activeRef.current = state.breathingActive
    if (!state.breathingActive) return
    setPhase('inhale')
    setCycles(0)

    let index = 0
    let cycleCount = 0
    let timer: ReturnType<typeof setTimeout>

    const run = () => {
      if (!activeRef.current) return
      setPhase(PHASE_ORDER[index])
      index++
      if (index >= PHASE_ORDER.length) {
        index = 0
        cycleCount++
        setCycles(cycleCount)
        if (cycleCount >= 4) {
          stopBreathing()
          return
        }
      }
      const prev = index === 0 ? PHASE_ORDER.length - 1 : index - 1
      timer = setTimeout(run, PHASE_DURATION[PHASE_ORDER[prev]])
    }

    timer = setTimeout(run, PHASE_DURATION.inhale)
    return () => clearTimeout(timer)
  }, [state.breathingActive, stopBreathing])

  const scale = phase === 'exhale' ? 1 : 1.5
  const opacity = phase === 'exhale' ? 0.5 : 1

  if (!state.breathingActive) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(230,168,23,0.08) 0%, transparent 70%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="relative flex flex-col items-center gap-8 px-6">
        <button
          onClick={() => stopBreathing()}
          className="absolute -top-12 right-0 text-fog hover:text-pure transition-colors"
        >
          <X size={20} />
        </button>

        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-cursive text-4xl text-pure mb-2">{PHASE_LABEL[phase]}</p>
          <p className="font-body text-sm text-fog max-w-xs">{PHASE_MESSAGE[phase]}</p>
        </motion.div>

        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ scale, opacity }}
            transition={{ duration: PHASE_DURATION[phase] / 1000, ease: 'easeInOut' }}
            className="w-40 h-40 rounded-full border-2 border-amber/40 flex items-center justify-center"
          >
            <Wind size={48} className="text-amber/60" />
          </motion.div>

          <svg className="absolute inset-0 w-40 h-40 -rotate-90">
            <motion.circle
              cx="80" cy="80" r="76"
              fill="none" stroke="currentColor" strokeWidth="1"
              className="text-amber/20"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: phase === 'exhale' ? 0 : 1 }}
              transition={{ duration: PHASE_DURATION[phase] / 1000, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        <div className="flex items-center gap-3">
          {PHASE_ORDER.map((p) => (
            <div
              key={p}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                phase === p ? 'bg-amber scale-125' : 'bg-graphite'
              }`}
            />
          ))}
        </div>

        <p className="font-mono text-caption text-fog">{cycles + 1} of 4 cycles</p>
      </div>
    </motion.div>
  )
}
