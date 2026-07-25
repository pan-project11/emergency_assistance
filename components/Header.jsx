'use client'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/lib/LanguageContext'

export default function Header() {
  const { strings } = useLanguage()

  return (
    <header className="bg-navy-900 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-5 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-white text-xl font-semibold">{strings.appTitle}</span>
          <span className="text-white/50 text-xs hidden sm:inline">{strings.tagline}</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/how-it-works" className="hidden sm:inline text-white/70 text-sm hover:text-white">
            {strings.howItWorksLink}
          </Link>
          <Link href="/volunteers" className="hidden sm:inline text-white/70 text-sm hover:text-white">
            Find volunteers
          </Link>
          <Link href="/volunteer" className="hidden sm:inline text-white/70 text-sm hover:text-white">
            {strings.volunteerPortalLink}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
