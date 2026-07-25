'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { geocodeLocation } from '@/lib/geocode'

const NEED_OPTIONS = ['rescue', 'food', 'shelter', 'medical']

export default function SOSForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: '', phone: '', address_line: '', city: '', state: '', postcode: '', country: '',
    people_count: 1, details: ''
  })
  const [needTypes, setNeedTypes] = useState([])
  const [coords, setCoords] = useState(null)
  const [locStatus, setLocStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleNeed = (need) => {
    setNeedTypes(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    )
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('Location not supported on this device.')
      return
    }
    setLocStatus('Getting your location...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setLocStatus('Location captured ✓')
      },
      () => setLocStatus('Could not get location. Please fill in the address fields instead.')
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (needTypes.length === 0) {
      setError('Please select at least one type of help needed.')
      return
    }
    if (!coords && (!form.address_line || !form.city || !form.country)) {
      setError('Please fill in address, city, and country.')
      return
    }

    setLoading(true)
    setError(null)

    const combinedAddress = [form.address_line, form.city, form.state, form.postcode, form.country]
      .filter(Boolean)
      .join(', ')

    let finalCoords = coords
    if (!finalCoords) {
      setLocStatus('Locating area on map...')
      finalCoords = await geocodeLocation({ city: form.city, state: form.state, country: form.country })
      setLocStatus(finalCoords ? 'Approximate area located ✓' : 'Could not pinpoint on map, but request was still saved.')
    }

    const { error } = await supabase.from('sos_requests').insert([{
      name: form.name,
      phone: form.phone,
      location_text: combinedAddress,
      city: form.city || null,
      state: form.state || null,
      country: form.country || null,
      people_count: Number(form.people_count),
      need_type: needTypes,
      details: form.details,
      latitude: finalCoords?.latitude ?? null,
      longitude: finalCoords?.longitude ?? null,
      status: 'pending'
    }])

    setLoading(false)
    if (error) {
      setError('Something went wrong. Please try again.')
      return
    }
    setForm({ name: '', phone: '', address_line: '', city: '', state: '', postcode: '', country: '', people_count: 1, details: '' })
    setNeedTypes([])
    setCoords(null)
    setLocStatus(null)
    if (onSubmitted) onSubmitted()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-red-600">Request Help</h2>

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

      <button
        type="button" onClick={useMyLocation}
        className="w-full border border-blue-600 text-blue-600 rounded-lg py-2 text-sm font-medium"
      >
        📍 Use my current location (most accurate, skips address fields below)
      </button>
      {locStatus && <p className="text-xs text-gray-500">{locStatus}</p>}

      {!coords && (
        <div className="space-y-3 border-t pt-3">
          <input
            name="address_line" value={form.address_line} onChange={handleChange} required
            placeholder="Address (house no, street, ward/kampung)"
            className="w-full border rounded-lg p-3"
          />
          <input
            name="city" value={form.city} onChange={handleChange} required
            placeholder="City / Town"
            className="w-full border rounded-lg p-3"
          />
          <input
            name="state" value={form.state} onChange={handleChange}
            placeholder="State / Province"
            className="w-full border rounded-lg p-3"
          />
          <input
            name="postcode" value={form.postcode} onChange={handleChange}
            placeholder="Postcode (optional)"
            className="w-full border rounded-lg p-3"
          />
          <input
            name="country" value={form.country} onChange={handleChange} required
            placeholder="Country"
            className="w-full border rounded-lg p-3"
          />
        </div>
      )}

      <input
        name="people_count" type="number" min="1" value={form.people_count} onChange={handleChange}
        placeholder="Number of people"
        className="w-full border rounded-lg p-3"
      />

      <div>
        <p className="text-sm font-medium mb-2">What kind of help do you need? (select all that apply)</p>
        <div className="grid grid-cols-2 gap-2">
          {NEED_OPTIONS.map((need) => (
            <label
              key={need}
              className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer text-sm capitalize ${
                needTypes.includes(need) ? 'border-red-600 bg-red-50 text-red-700 font-medium' : 'border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={needTypes.includes(need)}
                onChange={() => toggleNeed(need)}
                className="accent-red-600"
              />
              {need}
            </label>
          ))}
        </div>
      </div>

      <textarea
        name="details" value={form.details} onChange={handleChange}
        placeholder="Additional details (optional) — e.g. elderly/children present, water level, access notes"
        rows={3}
        className="w-full border rounded-lg p-3"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit" disabled={loading}
        className="w-full bg-red-600 text-white rounded-lg py-3 font-semibold disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  )
}
