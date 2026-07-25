'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { geocodeLocation } from '@/lib/geocode'

export default function SafeCheckin() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', city: '', state: '', country: '', notes: '' })
  const [coords, setCoords] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const useMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => {}
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let finalCoords = coords
    if (!finalCoords && (form.city || form.country)) {
      finalCoords = await geocodeLocation({ city: form.city, state: form.state, country: form.country })
    }

    const combinedLocation = [form.city, form.state, form.country].filter(Boolean).join(', ')

    const { error } = await supabase.from('safe_checkins').insert([{
      name: form.name,
      phone: form.phone,
      location_text: combinedLocation || null,
      city: form.city || null,
      state: form.state || null,
      country: form.country || null,
      latitude: finalCoords?.latitude ?? null,
      longitude: finalCoords?.longitude ?? null,
      notes: form.notes || null
    }])

    setLoading(false)
    if (error) {
      setError('Something went wrong. Please try again.')
      return
    }
    setSuccess(true)
    setForm({ name: '', phone: '', city: '', state: '', country: '', notes: '' })
    setCoords(null)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full max-w-md mx-auto block bg-green-600 text-white rounded-xl py-3 font-semibold shadow-md"
      >
        ✓ I'm Safe — Let people know
      </button>
    )
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto text-center">
        <p className="text-green-700 font-semibold">✓ Marked as safe. Thank you for checking in.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-3 max-w-md mx-auto">
      <h2 className="text-lg font-bold text-green-700">Mark Yourself Safe</h2>
      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="w-full border rounded-lg p-3" />
      <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone number" className="w-full border rounded-lg p-3" />
      <button type="button" onClick={useMyLocation} className="w-full border border-blue-600 text-blue-600 rounded-lg py-2 text-sm">
        📍 Use my current location (optional)
      </button>
      <input name="city" value={form.city} onChange={handleChange} placeholder="City / Town" className="w-full border rounded-lg p-3" />
      <input name="state" value={form.state} onChange={handleChange} placeholder="State / Province" className="w-full border rounded-lg p-3" />
      <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="w-full border rounded-lg p-3" />
      <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)" rows={2} className="w-full border rounded-lg p-3" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => setOpen(false)} className="flex-1 border rounded-lg py-3 text-sm font-medium">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white rounded-lg py-3 font-semibold disabled:opacity-50">
          {loading ? 'Saving...' : 'Confirm Safe'}
        </button>
      </div>
    </form>
  )
}
