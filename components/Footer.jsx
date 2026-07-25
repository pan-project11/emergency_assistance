'use client'
import { useLanguage } from '@/lib/LanguageContext'
import { BRAND_NAME } from '@/lib/i18nStrings'

export default function Footer() {
  const { strings } = useLanguage()

  return (
    <footer className="bg-navy-900 mt-auto">
      <div className="max-w-5xl mx-auto px-5 py-8 flex flex-col sm:flex-row justify-between gap-3">
        <p className="text-white/50 text-xs">{strings.footerPrivacyNote}</p>
        <p className="text-white/40 text-xs">© {new Date().getFullYear()} {BRAND_NAME}</p>
      </div>
    </footer>
  )
}
