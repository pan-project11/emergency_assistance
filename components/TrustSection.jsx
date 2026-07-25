'use client'
import { useLanguage } from '@/lib/LanguageContext'

export default function TrustSection() {
  const { strings } = useLanguage()

  return (
    <div className="bg-navy-950/[0.03] border-y border-black/5">
      <div className="max-w-5xl mx-auto px-5 py-10">
        <h2 className="font-serif text-xl mb-3">{strings.trustTitle}</h2>
        <p className="text-sm text-gray-600 max-w-2xl">{strings.trustBody}</p>
      </div>
    </div>
  )
}
