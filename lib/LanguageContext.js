'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { BASE_STRINGS, BRAND_NAME } from './i18nStrings'
import { translateStrings } from './translate'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [langCode, setLangCode] = useState('en')
  const [strings, setStrings] = useState(BASE_STRINGS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('app_language')
    if (saved) setLangCode(saved)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const translated = await translateStrings(BASE_STRINGS, langCode)
      // Brand name is never translated, regardless of language
      translated.appTitle = BRAND_NAME
      if (!cancelled) {
        setStrings(translated)
        setLoading(false)
      }
    }
    load()
    localStorage.setItem('app_language', langCode)
    return () => { cancelled = true }
  }, [langCode])

  return (
    <LanguageContext.Provider value={{ langCode, setLangCode, strings, loading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
