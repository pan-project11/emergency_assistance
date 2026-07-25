'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import SOSForm from '@/components/SOSForm'
import DonationForm from '@/components/DonationForm'
import SafeCheckin from '@/components/SafeCheckin'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/LanguageContext'

const PublicMap = dynamic(() => import('@/components/PublicMap'), { ssr: false })

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [requests, setRequests] = useState([])
  const [tab, setTab] = useState('help') // 'help' or 'donate'
  const { strings } = useLanguage()

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('sos_requests')
      .select('id, latitude, longitude, city, state, need_type, people_count, status')
      .order('created_at', { ascending: false })
    setRequests(data || [])
  }

  useEffect(() => { fetchRequests() }, [refreshKey])

  const counts = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    responding: requests.filter(r => r.status === 'responding').length,
    resolved: requests.filter(r => r.status === 'resolved').length
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto flex justify-between items-center mb-4">
        <LanguageSwitcher />
        <Link href="/volunteer" className="text-sm text-blue-700 underline font-medium">
          {strings.volunteerLinkText} →
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6 text-red-700">
        {strings.appTitle}
      </h1>

      <div className="max-w-md mx-auto mb-6">
        <SafeCheckin />
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <div className="grid grid-cols-4 gap-2 text-center mb-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-2xl font-bold">{counts.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-yellow-700">{counts.pending}</p>
            <p className="text-xs text-yellow-700">Pending</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-blue-700">{counts.responding}</p>
            <p className="text-xs text-blue-700">Responding</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-700">{counts.resolved}</p>
            <p className="text-xs text-green-700">Resolved</p>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-2">Where help is needed</h2>
        <PublicMap requests={requests} />
        <p className="text-xs text-gray-400 mt-1 text-center">
          Pins show general area only — personal details are kept private and visible to registered volunteers only.
        </p>
      </div>

      <div className="max-w-md mx-auto flex gap-2 mb-4">
        <button
          onClick={() => setTab('help')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${tab === 'help' ? 'bg-red-600 text-white' : 'bg-white border'}`}
        >
          🆘 Request Help
        </button>
        <button
          onClick={() => setTab('donate')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${tab === 'donate' ? 'bg-green-700 text-white' : 'bg-white border'}`}
        >
          🎁 Donate
        </button>
      </div>

      {tab === 'help' ? (
        <SOSForm onSubmitted={() => setRefreshKey(k => k + 1)} />
      ) : (
        <DonationForm onSubmitted={() => setRefreshKey(k => k + 1)} />
      )}
    </main>
  )
}
