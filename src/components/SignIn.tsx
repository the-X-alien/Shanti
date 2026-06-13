import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wind, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { authClient } from '@/lib/convex'

export default function SignIn() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'sign-up') {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name: name || 'User',
        })
        if (signUpError) {
          setError(signUpError.message || signUpError.statusText || 'Sign up failed')
          setLoading(false)
          return
        }
      }

      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      })
      if (signInError) {
        setError(signInError.message || signInError.statusText || 'Sign in failed')
        setLoading(false)
        return
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber to-amber/60 flex items-center justify-center">
              <Wind size={16} className="text-void" />
            </div>
            <span className="font-cursive text-2xl text-pure">Shanti</span>
          </Link>
          <h1 className="font-cursive text-3xl text-pure mb-2">
            {mode === 'sign-in' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="font-body text-sm text-fog">
            {mode === 'sign-in' ? 'Sign in to your account' : 'Start your wellness journey'}
          </p>
        </div>

        <div className="flex bg-white/[0.03] rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => { setMode('sign-in'); setError('') }}
            className={`flex-1 py-2 rounded-lg font-body text-xs transition-all ${
              mode === 'sign-in' ? 'bg-amber/10 text-amber' : 'text-fog/60 hover:text-fog'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('sign-up'); setError('') }}
            className={`flex-1 py-2 rounded-lg font-body text-xs transition-all ${
              mode === 'sign-up' ? 'bg-amber/10 text-amber' : 'text-fog/60 hover:text-fog'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'sign-up' && (
            <div>
              <label className="block font-body text-xs text-fog mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-pure font-body text-sm placeholder:text-fog/30 outline-none focus:border-amber/40 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block font-body text-xs text-fog mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-pure font-body text-sm placeholder:text-fog/30 outline-none focus:border-amber/40 transition-colors"
            />
          </div>

          <div>
            <label className="block font-body text-xs text-fog mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-pure font-body text-sm placeholder:text-fog/30 outline-none focus:border-amber/40 transition-colors"
            />
          </div>

          {error && (
            <p className="font-body text-xs text-amber/80 text-center">{error}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-2.5 rounded-xl bg-amber/10 border border-amber/30 text-amber font-body text-sm hover:bg-amber/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : null}
            {loading ? 'Please wait...' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>

        <p className="text-center mt-6">
          <Link to="/" className="font-body text-xs text-fog/50 hover:text-fog transition-colors">
            Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
