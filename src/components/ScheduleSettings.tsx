import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Loader2, Check } from 'lucide-react'
import { useWellness, EmailFrequency } from '@/context/WellnessContext'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'

const frequencies: { value: EmailFrequency; label: string; desc: string }[] = [
  { value: 'off', label: 'Off', desc: 'No emails' },
  { value: 'hourly', label: 'Hourly', desc: 'Every 60 minutes' },
  { value: 'daily', label: 'Daily', desc: 'Once per day' },
  { value: 'weekly', label: 'Weekly', desc: 'Once per week' },
  { value: 'monthly', label: 'Monthly', desc: 'Once per month' },
  { value: 'yearly', label: 'Yearly', desc: 'Once per year' },
]

export default function ScheduleSettings() {
  const { state, dispatch } = useWellness()
  const schedule = useQuery(api.email.getSchedule)
  const saveSchedule = useMutation(api.email.saveSchedule)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (schedule) {
      dispatch({ type: 'SET_EMAIL', value: schedule.email })
      dispatch({ type: 'SET_FREQUENCY', value: schedule.frequency })
    }
  }, [schedule, dispatch])

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveSchedule({ email: state.email, frequency: state.emailFrequency })
      dispatch({ type: 'SET_FREQUENCY', value: state.emailFrequency })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Failed to save schedule:', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock size={18} className="text-amber" />
        <h2 className="font-cursive text-xl text-pure">Check-in Schedule</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {frequencies.map((f) => {
          const isActive = state.emailFrequency === f.value
          return (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => dispatch({ type: 'SET_FREQUENCY', value: f.value })}
              type="button"
              className={`relative px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                isActive
                  ? 'bg-amber/10 border border-amber/40 shadow-[0_0_15px_rgba(230,168,23,0.15)]'
                  : 'bg-glass border border-white/5 hover:border-white/10'
              }`}
            >
              <p className={`font-body text-sm mb-0.5 ${isActive ? 'text-pure' : 'text-fog'}`}>
                {f.label}
              </p>
              <p className="font-mono text-[10px] text-fog/60">{f.desc}</p>
            </motion.button>
          )
        })}
      </div>

      <div>
        <label className="block font-body text-xs text-fog mb-1.5">Email address</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={state.email}
          onChange={(e) => dispatch({ type: 'SET_EMAIL', value: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-glass border border-white/5 text-pure font-body text-sm placeholder:text-fog/30 outline-none focus:border-amber/40 transition-colors"
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={saving || !state.email}
        className="w-full py-2.5 rounded-xl bg-amber/10 border border-amber/30 text-amber font-body text-sm hover:bg-amber/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : saved ? (
          <Check size={14} />
        ) : null}
        {saved ? 'Saved' : saving ? 'Saving...' : 'Save Schedule'}
      </motion.button>
    </div>
  )
}
