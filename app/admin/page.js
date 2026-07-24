'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import RequestList from '@/components/RequestList'

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded-xl p-6 space-y-4 w-full max-w-sm">
          <h1 className="text-xl font-bold">Admin Login</h1>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" required className="w-full border rounded-lg p-3"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" required className="w-full border rounded-lg p-3"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-red-600 text-white rounded-lg py-3 font-semibold">
            Log In
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-sm text-red-600 underline">Log out</button>
      </div>
      <RequestList refreshKey={0} isAdmin={true} />
    </main>
  )
}
