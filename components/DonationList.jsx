'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DonationList() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  async function fetchDonations() {
    setLoading(true)
    const result = await supabase.from('donations').select('*').order('created_at', { ascending: false })
    setDonations(result.data || [])
    setLoading(false)
  }

  useEffect(function () { fetchDonations() }, [])

  async function markCollected(id) {
    await supabase.from('donations').update({ status: 'collected' }).eq('id', id)
    fetchDonations()
  }

  const filtered = donations.filter(function (d) {
    if (filter === 'all') return true
    if (filter === 'pickup') return d.pickup_requested === true
    return d.donation_type === filter
  })

  const counts = {
    total: donations.length,
    items: donations.filter(function (d) { return d.donation_type === 'items' }).length,
    cash: donations.filter(function (d) { return d.donation_type === 'cash' }).length,
    pickupPending: donations.filter(function (d) { return d.pickup_requested && d.status === 'pending' }).length
  }

  if (loading) return <p className="text-center mt-6 text-sm text-gray-500">Loading donations...</p>

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-xl font-bold">{counts.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xl font-bold text-blue-700">{counts.items}</p>
          <p className="text-xs text-blue-700">Items</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xl font-bold text-green-700">{counts.cash}</p>
          <p className="text-xs text-green-700">Cash</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3">
          <p className="text-xl font-bold text-amber-700">{counts.pickupPending}</p>
          <p className="text-xs text-amber-700">Pickup pending</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'items', 'cash', 'pickup'].map(function (f) {
          return (
            <button
              key={f}
              onClick={function () { setFilter(f) }}
              className={'text-xs px-3 py-1.5 rounded-full border ' + (filter === f ? 'bg-navy-900 text-white border-navy-900' : 'text-gray-600')}
            >
              {f === 'all' ? 'All' : f === 'items' ? 'Items' : f === 'cash' ? 'Cash' : 'Pickup requested'}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && <p className="text-sm text-gray-500">No donations match this filter.</p>}

      {filtered.map(function (d) {
        return (
          <div key={d.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold">{d.donor_name} • {d.donor_phone}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(d.created_at).toLocaleString()}</p>
              </div>
              <span className={'text-xs px-2 py-1 rounded-full whitespace-nowrap ' + (d.status === 'collected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
                {d.status}
              </span>
            </div>

            {d.donation_type === 'items' ? (
              <div className="mt-2 text-sm">
                <p><span className="font-medium">Items:</span> {d.item_description}</p>
                {d.pickup_requested && (
                  <p className="mt-1 text-amber-700">
                    <span className="font-medium">Pickup requested:</span> {d.pickup_address}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-2 text-sm">
                <p><span className="font-medium">Type:</span> Bank transfer</p>
                {d.transfer_reference && <p><span className="font-medium">Reference:</span> {d.transfer_reference}</p>}
              </div>
            )}

            {d.status !== 'collected' && (
              <button
                onClick={function () { markCollected(d.id) }}
                className="mt-3 text-xs px-3 py-1.5 rounded bg-forest-700 text-white font-medium"
              >
                Mark collected
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
