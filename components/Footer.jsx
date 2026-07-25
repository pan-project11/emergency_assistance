'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { BRAND_NAME } from '@/lib/i18nStrings'

export default function Footer() {
  const { strings } = useLanguage()

  return (
    <footer className="bg-navy-900 mt-auto">
      <div className="max-w-5xl mx-auto px-5 py-8 flex flex-col sm:flex-row justify-between gap-4">
        <p className="text-white/50 text-xs max-w-md">{strings.footerPrivacyNote}</p>
        <div className="flex flex-col sm:items-end gap-2">
          <div className="flex gap-4">
            <Link href="/privacy" className="text-white/50 text-xs hover:text-white">Privacy policy</Link>
            <Link href="/terms" className="text-white/50 text-xs hover:text-white">Terms</Link>
          </div>
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} {BRAND_NAME}</p>
        </div>
      </div>
    </footer>
  )
}
