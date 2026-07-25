'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useLanguage } from '@/lib/LanguageContext'

export default function Hero() {
  const { strings } = useLanguage()
  const [counts, setCounts] = useState({ total: 0, pending: 0, responding: 0, resolved: 0 })

  useEffect(() => {
    async function fetchCounts() {
      const { data } = await supabase.from('sos_requests').select('status')
      const rows = data || []
      setCounts({
        total: rows.length,
        pending: rows.filter(r => r.status === 'pending').length,
        responding: rows.filter(r => r.status === 'responding').length,
        resolved: rows.filter(r => r.status === 'resolved').length
      })
    }
    fetchCounts()
  }, [])

  return (
    <div className="bg-navy-900">
      <div className="max-w-5xl mx-auto px-5 pt-10 pb-8">
        <span className="text-xs tracking-widest text-red-300 font-medium uppercase">
          {strings.heroEyebrow}
        </span>
        <h1 className="font-serif text-white text-3xl sm:text-4xl leading-tight mt-3 mb-3 max-w-xl">
          {strings.heroHeadline}
        </h1>
        <p className="text-white/65 text-sm max-w-md mb-6">
          {strings.heroSubhead}
        </p>
        <div className="flex gap-3">
          <Link href="/request-help" className="bg-crimson-600 text-white text-sm font-semibold px-5 py-3 rounded">
            🆘 {strings.requestHelpBtn}
          </Link>
          <Link href="/donate" className="border border-white/40 text-white text-sm font-semibold px-5 py-3 rounded">
            {strings.wantToHelpBtn}
          </Link>
        </div>
      </div>

      <div className="bg-navy-950 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-5 py-3 flex divide-x divide-white/15">
          <div className="flex-1 pr-4">
            <p className="font-mono text-white text-lg">{counts.total}</p>
            <p className="text-[10px] tracking-widest text-white/50 mt-0.5 uppercase">{strings.tickerTotal}</p>
          </div>
          <div className="flex-1 px-4 text-center">
            <p className="font-mono text-amber-400 text-lg">{counts.pending}</p>
            <p className="text-[10px] tracking-widest text-white/50 mt-0.5 uppercase">{strings.tickerPending}</p>
          </div>
          <div className="flex-1 px-4 text-center">
            <p className="font-mono text-blue-400 text-lg">{counts.responding}</p>
            <p className="text-[10px] tracking-widest text-white/50 mt-0.5 uppercase">{strings.tickerResponding}</p>
          </div>
          <div className="flex-1 pl-4 text-right">
            <p className="font-mono text-green-400 text-lg">{counts.resolved}</p>
            <p className="text-[10px] tracking-widest text-white/50 mt-0.5 uppercase">{strings.tickerResolved}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
