'use client'
import { useState } from 'react'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/lib/LanguageContext'

export default function Header() {
  const { strings } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-navy-900 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-5 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-white text-xl font-semibold">{strings.appTitle}</span>
          <span className="text-white/50 text-xs hidden sm:inline">{strings.tagline}</span>
        </Link>

        <div className="hidden sm:flex items-center gap-5">
          <Link href="/how-it-works" className="text-white/70 text-sm hover:text-white">{strings.howItWorksLink}</Link>
          <Link href="/volunteers" className="text-white/70 text-sm hover:text-white">Find volunteers</Link>
          <Link href="/volunteer" className="text-white/70 text-sm hover:text-white">{strings.volunteerPortalLink}</Link>
          <LanguageSwitcher />
        </div>

        <button
          onClick={function () { setMenuOpen(!menuOpen) }}
          className="sm:hidden text-white text-2xl leading-none"
          aria-label="Menu"
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 px-5 py-4 flex flex-col gap-4">
          <Link href="/how-it-works" onClick={function () { setMenuOpen(false) }} className="text-white/80 text-sm">{strings.howItWorksLink}</Link>
          <Link href="/volunteers" onClick={function () { setMenuOpen(false) }} className="text-white/80 text-sm">Find volunteers</Link>
          <Link href="/volunteer" onClick={function () { setMenuOpen(false) }} className="text-white/80 text-sm">{strings.volunteerPortalLink}</Link>
          <div className="pt-2"><LanguageSwitcher /></div>
        </div>
      )}
    </header>
  )
}
