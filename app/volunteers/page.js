'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [areaFilter, setAreaFilter] = useState('')
  const [skillFilter, setSkillFilter] = useState('')

  useEffect(function () {
    async function fetchVolunteers() {
      setLoading(true)
      const result = await supabase.from('volunteers').select('*').order('created_at', { ascending: false })
      setVolunteers(result.data || [])
      setLoading(false)
    }
    fetchVolunteers()
  }, [])

  const filtered = volunteers.filter(function (v) {
    const matchesArea = v.location_text.toLowerCase().includes(areaFilter.toLowerCase())
    const matchesSkill = !skillFilter || (v.skills || '').toLowerCase().includes(skillFilter.toLowerCase())
    return matchesArea && matchesSkill
  })

  function callHref(phone) { return 'tel:' + phone }
  function waHref(phone) { return 'https://wa.me/' + phone.replace(/[^0-9]/g, '') }

  return (
    <main className="min-h-screen flex flex-col bg-[--background]">
      <Header />
      <div className="max-w-5xl mx-auto px-5 py-12 w-full flex-1">
        <h1 className="font-serif text-2xl mb-2">Volunteers by area</h1>
        <p className="text-sm text-gray-500 mb-6">Browse registered volunteers and reach out directly for help in your area.</p>
        <div className="flex gap-2 mb-6">
          <input value={areaFilter} onChange={function (e) { setAreaFilter(e.target.value) }} placeholder="Filter by area" className="flex-1 border rounded-lg p-3" />
          <input value={skillFilter} onChange={function (e) { setSkillFilter(e.target.value) }} placeholder="Filter by skill" className="flex-1 border rounded-lg p-3" />
        </div>
        {loading && <p className="text-gray-500">Loading volunteers...</p>}
        {!loading && filtered.length === 0 && <p className="text-gray-500">No volunteers match this filter yet.</p>}
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(function (v) {
            return (
              <div key={v.id} className="border border-black/10 rounded-lg p-4 bg-white">
                <p className="font-semibold">{v.name}</p>
                <p className="text-sm text-gray-500 mb-1">{v.location_text}</p>
                {v.skills && <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Skills:</span> {v.skills}</p>}
                <div className="flex gap-2">
                  <a href={callHref(v.phone)} className="flex-1 text-center text-sm font-medium bg-navy-900 text-white rounded-lg py-2">Call</a>
                  <a href={waHref(v.phone)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm font-medium bg-forest-700 text-white rounded-lg py-2">WhatsApp</a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Footer />
    </main>
  )
}
