'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import GetInvolved from '@/components/GetInvolved'
import TrustSection from '@/components/TrustSection'
import Footer from '@/components/Footer'
import SafeCheckin from '@/components/SafeCheckin'

const PublicMap = dynamic(() => import('@/components/PublicMap'), { ssr: false })

export default function HomeClient() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    async function fetchRequests() {
      const { data } = await supabase
        .from('sos_requests')
        .select('id, latitude, longitude, city, state, need_type, people_count, status')
        .order('created_at', { ascending: false })
      setRequests(data || [])
    }
    fetchRequests()
  }, [])

  return (
    <main className="min-h-screen flex flex-col bg-[--background]">
      <Header />
      <Hero />
      <HowItWorks />

      <div className="max-w-5xl mx-auto px-5 py-12 w-full">
        <div className="max-w-md mx-auto mb-8">
          <SafeCheckin />
        </div>

        <h2 className="font-serif text-2xl mb-4">Where help is needed</h2>
        <PublicMap requests={requests} />
        <p className="text-xs text-gray-400 mt-2">
          Pins show general area only — personal details are kept private and visible to registered volunteers only.
        </p>
      </div>

      <GetInvolved />
      <TrustSection />
      <Footer />
    </main>
  )
}
