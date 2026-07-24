'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { setVolunteerIdentity } from '@/lib/volunteerIdentity'

export default function VolunteerForm({ onRegistered }) {
  const [form, setForm] = useState({ name: '', phone: '', location_text: '', skills: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('volunteers').insert([{
      name: form.name,
      phone: form.phone,
      location_text: form.location_text,
      skills: form.skills
    }])

    setLoading(false)
    if (error) {
      setError('Something went wrong. Please try again.')
      return
    }

    setVolunteerIdentity({ name: form.name, phone: form.phone })
    if (onRegistered) onRegistered({ name: form.name, phone: form.phone })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-blue-700">Register as Volunteer</h2>

      <input
        name="name" value={form.name} onChange={handleChange} required
        placeholder="Your name"
        className="w-full border rounded-lg p-3"
      />
      <input
        name="phone" value={form.phone} onChange={handleChange} required
        placeholder="Phone number"
        className="w-full border rounded-lg p-3"
      />
      <input
        name="location_text" value={form.location_text} onChange={handleChange} required
        placeholder="Your area (e.g. Rawang, Selangor)"
        className="w-full border rounded-lg p-3"
      />
      <input
        name="skills" value={form.skills} onChange={handleChange}
        placeholder="Skills / vehicle / notes (optional)"
        className="w-full border rounded-lg p-3"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit" disabled={loading}
        className="w-full bg-blue-700 text-white rounded-lg py-3 font-semibold disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}
