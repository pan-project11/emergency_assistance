import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BRAND_NAME } from '@/lib/i18nStrings'

export const metadata = {
  title: 'Terms of service — Xohai',
  description: 'Terms governing the use of the Xohai platform.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[--background]">
      <Header />
      <div className="max-w-3xl mx-auto px-5 py-12 w-full flex-1">
        <h1 className="font-serif text-2xl mb-2">Terms of service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-base mb-2">What {BRAND_NAME} is</h2>
            <p>{BRAND_NAME} is a community coordination platform connecting people who need emergency assistance with volunteers and donors who can help. We facilitate these connections but are not a licensed emergency service, government agency, or first responder.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">In a life-threatening emergency</h2>
            <p>If you are in immediate danger, contact your local emergency services first. {BRAND_NAME} is a coordination tool and response times from volunteers are not guaranteed.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">Accuracy of information</h2>
            <p>Users are responsible for the accuracy of information they submit, including requests for help, volunteer registrations, and donation offers. Providing false information may delay real assistance to others.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">Volunteer conduct</h2>
            <p>Volunteers act independently and are not employees or agents of {BRAND_NAME}. We do not verify volunteer credentials or conduct background checks. Exercise reasonable caution when meeting anyone in person.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">No liability</h2>
            <p>{BRAND_NAME} provides this platform "as is" and is not liable for the actions of volunteers, donors, or requesters, or for the outcome of any coordination made through the platform.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
