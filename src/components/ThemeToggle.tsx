import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('light', !dark)
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed top-4 left-4 z-40 glass-elevated rounded-lg px-2.5 py-2
        text-ash hover:text-pure transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        key={dark ? 'moon' : 'sun'}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {dark ? <Moon size={16} /> : <Sun size={16} />}
      </motion.div>
    </button>
  )
}
