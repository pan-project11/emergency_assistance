'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RequestList from '@/components/RequestList'
import DonationList from '@/components/DonationList'

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('requests')

  useEffect(function () {
    supabase.auth.getSession().then(function (result) { setSession(result.data.session) })
    const listener = supabase.auth.onAuthStateChange(function (event, sess) { setSession(sess) })
    return function () { listener.data.subscription.unsubscribe() }
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (result.error) setError(result.error.message)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col bg-[--background]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <form onSubmit={handleLogin} className="bg-white shadow-md rounded-xl p-6 space-y-4 w-full max-w-sm">
            <h1 className="text-xl font-bold">Admin login</h1>
            <input type="email" value={email} onChange={function (e) { setEmail(e.target.value) }} placeholder="Email" required className="w-full border rounded-lg p-3" />
            <input type="password" value={password} onChange={function (e) { setPassword(e.target.value) }} placeholder="Password" required className="w-full border rounded-lg p-3" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-crimson-600 text-white rounded-lg py-3 font-semibold">Log in</button>
          </form>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-[--background]">
      <Header />
      <div className="max-w-2xl mx-auto px-5 py-10 w-full flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-serif text-2xl">Admin dashboard</h1>
          <button onClick={handleLogout} className="text-sm text-crimson-600 underline">Log out</button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={function () { setTab('requests') }}
            className={'flex-1 py-2 rounded-lg text-sm font-semibold ' + (tab === 'requests' ? 'bg-navy-900 text-white' : 'bg-white border')}
          >
            Requests
          </button>
          <button
            onClick={function () { setTab('donations') }}
            className={'flex-1 py-2 rounded-lg text-sm font-semibold ' + (tab === 'donations' ? 'bg-forest-700 text-white' : 'bg-white border')}
          >
            Donations
          </button>
        </div>

        {tab === 'requests' ? <RequestList refreshKey={0} isAdmin={true} /> : <DonationList />}
      </div>
      <Footer />
    </main>
  )
}
