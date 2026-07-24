'use client'
import { useState } from 'react'
import Link from 'next/link'
import SOSForm from '@/components/SOSForm'
import RequestList from '@/components/RequestList'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/LanguageContext'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { strings } = useLanguage()

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto flex justify-between items-center mb-4">
        <LanguageSwitcher />
        <Link href="/volunteer" className="text-sm text-blue-700 underline font-medium">
          {strings.volunteerLinkText} →
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-center mb-8 text-red-700">
        {strings.appTitle}
      </h1>
      <SOSForm onSubmitted={() => setRefreshKey(k => k + 1)} />
      <RequestList refreshKey={refreshKey} />
    </main>
  )
}
