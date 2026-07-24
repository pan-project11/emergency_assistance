'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  responding: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800'
}

function formatNeed(need_type) {
  return Array.isArray(need_type) ? need_type.join(', ') : need_type
}

export default function RequestList({ refreshKey, isAdmin = false }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('sos_requests')
      .select('*')
      .order('created_at', { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchRequests() }, [refreshKey])

  const updateStatus = async (id, status) => {
    await supabase.from('sos_requests').update({ status }).eq('id', id)
    fetchRequests()
  }

  if (loading) return <p className="text-center mt-6">Loading requests...</p>

  const counts = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    responding: requests.filter(r => r.status === 'responding').length,
    resolved: requests.filter(r => r.status === 'resolved').length
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      <h2 className="text-xl font-bold">Active Requests</h2>

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

      {requests.length === 0 && <p className="text-gray-500">No requests yet.</p>}
      {requests.map((r) => (
        <div key={r.id} className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{r.name} • {r.phone}</p>
              <p className="text-sm text-gray-600">{r.location_text}</p>
              <p className="text-sm">Need: <span className="font-medium">{formatNeed(r.need_type)}</span> • {r.people_count} people</p>
              {r.details && <p className="text-sm text-gray-500 mt-1">"{r.details}"</p>}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[r.status]}`}>
              {r.status}
            </span>
          </div>

          {isAdmin && (
            <div className="mt-3 flex gap-2">
              <button onClick={() => updateStatus(r.id, 'pending')} className="text-xs px-3 py-1 rounded bg-yellow-500 text-white">Pending</button>
              <button onClick={() => updateStatus(r.id, 'responding')} className="text-xs px-3 py-1 rounded bg-blue-500 text-white">Responding</button>
              <button onClick={() => updateStatus(r.id, 'resolved')} className="text-xs px-3 py-1 rounded bg-green-600 text-white">Resolved</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
