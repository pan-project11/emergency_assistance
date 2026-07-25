'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DonationForm({ onSubmitted }) {
  const [form, setForm] = useState({
    donor_name: '', donor_phone: '', donation_type: 'items',
    item_description: '', pickup_requested: false, pickup_address: '', transfer_reference: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    setForm({ ...form, [target.name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await supabase.from('donations').insert([{
      donor_name: form.donor_name,
      donor_phone: form.donor_phone,
      donation_type: form.donation_type,
      item_description: form.donation_type === 'items' ? form.item_description : null,
      pickup_requested: form.donation_type === 'items' ? form.pickup_requested : false,
      pickup_address: form.pickup_requested ? form.pickup_address : null,
      transfer_reference: form.donation_type === 'cash' ? form.transfer_reference : null,
      status: 'pending'
    }])

    setLoading(false)
    if (result.error) {
      setError('Something went wrong. Please try again.')
      return
    }
    setSuccess(true)
    setForm({ donor_name: '', donor_phone: '', donation_type: 'items', item_description: '', pickup_requested: false, pickup_address: '', transfer_reference: '' })
    if (onSubmitted) onSubmitted()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-forest-700">Donate</h2>

      <div className="grid grid-cols-2 gap-2">
        <label className={'text-center border rounded-lg p-3 cursor-pointer text-sm font-medium ' + (form.donation_type === 'items' ? 'border-forest-700 bg-green-50 text-forest-700' : 'border-gray-300')}>
          <input type="radio" name="donation_type" value="items" checked={form.donation_type === 'items'} onChange={handleChange} className="hidden" />
          Items
        </label>
        <label className={'text-center border rounded-lg p-3 cursor-pointer text-sm font-medium ' + (form.donation_type === 'cash' ? 'border-forest-700 bg-green-50 text-forest-700' : 'border-gray-300')}>
          <input type="radio" name="donation_type" value="cash" checked={form.donation_type === 'cash'} onChange={handleChange} className="hidden" />
          Bank transfer
        </label>
      </div>

      <input name="donor_name" value={form.donor_name} onChange={handleChange} required placeholder="Your name" className="w-full border rounded-lg p-3" />
      <input name="donor_phone" value={form.donor_phone} onChange={handleChange} required placeholder="Phone number" className="w-full border rounded-lg p-3" />

      {form.donation_type === 'items' ? (
        <>
          <textarea name="item_description" value={form.item_description} onChange={handleChange} required placeholder="What are you donating? (e.g. rice, blankets, bottled water, clothes)" rows={3} className="w-full border rounded-lg p-3" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="pickup_requested" checked={form.pickup_requested} onChange={handleChange} className="accent-forest-700" />
            I'd like this picked up instead of dropping it off
          </label>
          {form.pickup_requested && (
            <input name="pickup_address" value={form.pickup_address} onChange={handleChange} required placeholder="Pickup address" className="w-full border rounded-lg p-3" />
          )}
        </>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm space-y-2">
          <p className="font-medium text-amber-800">Bank transfer is not yet set up</p>
          <p className="text-amber-700">We're finalising our relief fund account details. Leave your phone number below and we'll reach out with transfer instructions, or choose "Items" to donate directly instead.</p>
          <input
            name="transfer_reference" value={form.transfer_reference} onChange={handleChange}
            placeholder="Notes (optional)"
            className="w-full border rounded-lg p-2 mt-2"
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-forest-700 text-sm">Thank you! Your donation has been recorded.</p>}

      <button type="submit" disabled={loading} className="w-full bg-forest-700 text-white rounded-lg py-3 font-semibold disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit Donation'}
      </button>
    </form>
  )
}
