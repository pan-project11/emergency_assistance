'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SOSForm from '@/components/SOSForm'

export default function RequestHelpClient() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="min-h-screen flex flex-col bg-[--background]">
      <Header />
      <div className="max-w-5xl mx-auto px-5 py-12 w-full flex-1">
        <h1 className="font-serif text-2xl mb-6">Request help</h1>
        <SOSForm onSubmitted={() => setRefreshKey(k => k + 1)} />
      </div>
      <Footer />
    </main>
  )
}
