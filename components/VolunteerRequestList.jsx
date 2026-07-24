'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabaseClient'

const RequestMap = dynamic(() => import('./RequestMap'), { ssr: false })

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  responding: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800'
}

function formatNeed(need_type) {
  return Array.isArray(need_type) ? need_type.join(', ') : need_type
}

function isClaimActive(request) {
  if (!request.claimed_at) return false
  const claimedTime = new Date(request.claimed_at).getTime()
  return Date.now() - claimedTime < 24 * 60 * 60 * 1000
}

export default function VolunteerRequestList({ volunteer }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationFilter, setLocationFilter] = useState('')
  const [view, setView] = useState('list')
  const [selected, setSelected] = useState([])

  const fetchRequests = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('sos_requests')
      .select('*')
      .order('created_at', { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchRequests() }, [])

  const filtered = requests.filter(r =>
    r.location_text.toLowerCase().includes(locationFilter.toLowerCase())
  )

  const counts = {
    total: filtered.length,
    pending: filtered.filter(r => r.status === 'pending').length,
    responding: filtered.filter(r => r.status === 'responding').length,
    resolved: filtered.filter(r => r.status === 'resolved').length
  }

  const claim = async (id) => {
    await supabase.rpc('claim_request', {
      p_request_id: id,
      p_name: volunteer.name,
      p_phone: volunteer.phone
    })
    fetchRequests()
  }

  const updateStatus = async (id, status) => {
    await supabase.rpc('update_claimed_status', {
      p_request_id: id,
      p_phone: volunteer.phone,
      p_status: status
    })
    fetchRequests()
  }

  const bulkClaim = async () => {
    for (const id of selected) {
      await supabase.rpc('claim_request', {
        p_request_id: id,
        p_name: volunteer.name,
        p_phone: volunteer.phone
      })
    }
    setSelected([])
    fetchRequests()
  }

  const bulkUpdate = async (status) => {
    for (const id of selected) {
      await supabase.rpc('update_claimed_status', {
        p_request_id: id,
        p_phone: volunteer.phone,
        p_status: status
      })
    }
    setSelected([])
    fetchRequests()
  }

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  if (loading) return <p className="text-center mt-6">Loading requests...</p>

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-2xl font-bold">{counts.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-yellow-700">{counts.pending}</p>
          <p className="text-xs text-yellow-700">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-blue-700">{counts.responding}</p>
          <p className="text-xs text-blue-700">Responding</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-green-700">{counts.resolved}</p>
          <p className="text-xs text-green-700">Resolved</p>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <input
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          placeholder="Filter by location..."
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={() => setView(view === 'list' ? 'map' : 'list')}
          className="border rounded-lg px-3 py-2 text-sm font-medium"
        >
          {view === 'list' ? '🗺️ Map view' : '📋 List view'}
        </button>
      </div>

      {view === 'map' ? (
        <RequestMap requests={filtered} />
      ) : (
        <>
          {selected.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2 items-center flex-wrap">
              <span className="text-sm">{selected.length} selected</span>
              <button onClick={bulkClaim} className="text-xs px-3 py-1 rounded bg-indigo-600 text-white">Claim Selected</button>
              <button onClick={() => bulkUpdate('responding')} className="text-xs px-3 py-1 rounded bg-blue-500 text-white">Mark Responding</button>
              <button onClick={() => bulkUpdate('resolved')} className="text-xs px-3 py-1 rounded bg-green-600 text-white">Mark Resolved</button>
            </div>
          )}

          {filtered.length === 0 && <p className="text-gray-500">No requests match this filter.</p>}

          {filtered.map((r) => {
            const claimedActive = isClaimActive(r)
            const claimedByMe = claimedActive && r.volunteer_phone === volunteer.phone
            const claimedByOther = claimedActive && r.volunteer_phone !== volunteer.phone

            return (
              <div key={r.id} className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-2">
                    {(claimedByMe || !claimedActive) && (
                      <input
                        type="checkbox"
                        checked={selected.includes(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        className="mt-1"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{r.name} • {r.phone}</p>
                      <p className="text-sm text-gray-600">{r.location_text}</p>
                      <p className="text-sm">Need: <span className="font-medium">{formatNeed(r.need_type)}</span> • {r.people_count} people</p>
                      {r.details && <p className="text-sm text-gray-500 mt-1">"{r.details}"</p>}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusColors[r.status]}`}>
                    {r.status}
                  </span>
                </div>

                <div className="mt-3 flex gap-2 flex-wrap items-center">
                  {!claimedActive && (
                    <button onClick={() => claim(r.id)} className="text-xs px-3 py-1 rounded bg-indigo-600 text-white">
                      Claim this request
                    </button>
                  )}
                  {claimedByOther && (
                    <span className="text-xs text-gray-500">Claimed by another volunteer (expires in 24h)</span>
                  )}
                  {claimedByMe && (
                    <>
                      <span className="text-xs text-indigo-700 font-medium">Claimed by you</span>
                      <button onClick={() => updateStatus(r.id, 'responding')} className="text-xs px-3 py-1 rounded bg-blue-500 text-white">Responding</button>
                      <button onClick={() => updateStatus(r.id, 'resolved')} className="text-xs px-3 py-1 rounded bg-green-600 text-white">Resolved</button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
