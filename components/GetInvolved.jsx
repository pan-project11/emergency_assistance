'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function GetInvolved() {
  const { strings } = useLanguage()

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <h2 className="font-serif text-2xl mb-6">{strings.getInvolvedTitle}</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/volunteer" className="block border border-black/10 rounded-lg p-5 hover:border-navy-900 transition-colors">
          <p className="font-semibold mb-1">{strings.volunteerCardTitle}</p>
          <p className="text-sm text-gray-500">{strings.volunteerCardBody}</p>
        </Link>
        <Link href="/volunteers" className="block border border-black/10 rounded-lg p-5 hover:border-navy-900 transition-colors">
          <p className="font-semibold mb-1">Find volunteers</p>
          <p className="text-sm text-gray-500">Browse and contact registered volunteers directly by area.</p>
        </Link>
        <Link href="/donate" className="block border border-black/10 rounded-lg p-5 hover:border-forest-700 transition-colors">
          <p className="font-semibold mb-1">{strings.donateCardTitle}</p>
          <p className="text-sm text-gray-500">{strings.donateCardBody}</p>
        </Link>
      </div>
    </div>
  )
}
