'use client'
import { useLanguage } from '@/lib/LanguageContext'
import { LANGUAGES } from '@/lib/languageList'

export default function LanguageSwitcher() {
  const { langCode, setLangCode, loading } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <select
        value={langCode}
        onChange={(e) => setLangCode(e.target.value)}
        className="border rounded-lg px-2 py-1 text-sm bg-white"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.name}</option>
        ))}
      </select>
      {loading && <span className="text-xs text-gray-400">Translating...</span>}
    </div>
  )
}
