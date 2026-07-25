'use client'
import { useLanguage } from '@/lib/LanguageContext'

export default function HowItWorks() {
  const { strings } = useLanguage()

  const steps = [
    { n: '01', title: strings.step1Title, body: strings.step1Body },
    { n: '02', title: strings.step2Title, body: strings.step2Body },
    { n: '03', title: strings.step3Title, body: strings.step3Body }
  ]

  return (
    <div id="how-it-works" className="bg-white border-y border-black/5">
      <div className="max-w-5xl mx-auto px-5 py-12">
        <h2 className="font-serif text-2xl mb-8">{strings.howItWorksTitle}</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.n}>
              <span className="font-mono text-xs text-gray-400">{s.n}</span>
              <p className="font-semibold text-sm mt-2 mb-1">{s.title}</p>
              <p className="text-sm text-gray-500">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
