import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HowItWorks from '@/components/HowItWorks'

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[--background]">
      <Header />
      <div className="flex-1">
        <HowItWorks />
      </div>
      <Footer />
    </main>
  )
}
