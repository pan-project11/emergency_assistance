import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BRAND_NAME } from '@/lib/i18nStrings'

export const metadata = {
  title: 'Privacy policy — Xohai',
  description: 'How Xohai collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[--background]">
      <Header />
      <div className="max-w-3xl mx-auto px-5 py-12 w-full flex-1">
        <h1 className="font-serif text-2xl mb-2">Privacy policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-base mb-2">What we collect</h2>
            <p>When you request help, register as a volunteer, mark yourself safe, or donate, we collect your name, phone number, and location details (address, city, state, or country). If you use "current location," we collect precise GPS coordinates.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">How we use it</h2>
            <p>Your information is used solely to coordinate emergency response — connecting people who need help with volunteers who can provide it, and tracking the status of requests and donations. We do not use your information for advertising or sell it to third parties.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">Who can see it</h2>
            <p>Requests for help show only a general area (city/state) on the public map — names, phone numbers, and exact addresses are never shown publicly. Full details are visible only to registered volunteers coordinating a response. Volunteers who register to help are listed publicly with their name, area, and skills so people in need can contact them directly.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">Data retention</h2>
            <p>We retain request and donation records to maintain a history of response efforts. You may contact us to request deletion of your personal data at any time.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">Contact</h2>
            <p>Questions about this policy or your data can be directed to the {BRAND_NAME} team through our contact channels.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
