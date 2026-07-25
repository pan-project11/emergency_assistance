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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('donations').insert([{
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
    if (error) {
      setError('Something went wrong. Please try again.')
      return
    }
    setSuccess(true)
    setForm({ donor_name: '', donor_phone: '', donation_type: 'items', item_description: '', pickup_requested: false, pickup_address: '', transfer_reference: '' })
    if (onSubmitted) onSubmitted()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-green-700">Donate</h2>

      <div className="grid grid-cols-2 gap-2">
        <label className={`text-center border rounded-lg p-3 cursor-pointer text-sm font-medium ${form.donation_type === 'items' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-300'}`}>
          <input type="radio" name="donation_type" value="items" checked={form.donation_type === 'items'} onChange={handleChange} className="hidden" />
          📦 Items
        </label>
        <label className={`text-center border rounded-lg p-3 cursor-pointer text-sm font-medium ${form.donation_type === 'cash' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-300'}`}>
          <input type="radio" name="donation_type" value="cash" checked={form.donation_type === 'cash'} onChange={handleChange} className="hidden" />
          💰 Bank Transfer
        </label>
      </div>

      <input
        name="donor_name" value={form.donor_name} onChange={handleChange} required
        placeholder="Your name"
        className="w-full border rounded-lg p-3"
      />
      <input
        name="donor_phone" value={form.donor_phone} onChange={handleChange} required
        placeholder="Phone number"
        className="w-full border rounded-lg p-3"
      />

      {form.donation_type === 'items' ? (
        <>
          <textarea
            name="item_description" value={form.item_description} onChange={handleChange} required
            placeholder="What are you donating? (e.g. rice, blankets, bottled water, clothes)"
            rows={3}
            className="w-full border rounded-lg p-3"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="pickup_requested" checked={form.pickup_requested} onChange={handleChange} className="accent-green-600" />
            I'd like this picked up instead of dropping it off
          </label>
          {form.pickup_requested && (
            <input
              name="pickup_address" value={form.pickup_address} onChange={handleChange} required
              placeholder="Pickup address"
              className="w-full border rounded-lg p-3"
            />
          )}
        </>
      ) : (
        <div className="bg-gray-50 border rounded-lg p-4 text-sm space-y-2">
          <p className="font-medium">Bank Transfer Details</p>
          <p>Account Name: [Your relief fund name]</p>
          <p>Bank: [Bank name]</p>
          <p>Account No: [Account number]</p>
          <input
            name="transfer_reference" value={form.transfer_reference} onChange={handleChange}
            placeholder="Transfer reference / receipt no. (optional)"
            className="w-full border rounded-lg p-2 mt-2"
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Thank you! Your donation has been recorded.</p>}

      <button
        type="submit" disabled={loading}
        className="w-full bg-green-700 text-white rounded-lg py-3 font-semibold disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Donation'}
      </button>
    </form>
  )
}
