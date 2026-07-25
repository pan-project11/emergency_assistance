'use client'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const statusColor = {
  pending: '#eab308',
  responding: '#3b82f6',
  resolved: '#16a34a'
}

function formatNeed(need_type) {
  return Array.isArray(need_type) ? need_type.join(', ') : need_type
}

export default function PublicMap({ requests }) {
  const pinned = requests.filter(r => r.latitude && r.longitude)
  const center = pinned.length > 0
    ? [pinned[0].latitude, pinned[0].longitude]
    : [3.1390, 101.6869] // default: Kuala Lumpur

  return (
    <div className="rounded-xl overflow-hidden border" style={{ height: '400px' }}>
      <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pinned.map((r) => (
          <CircleMarker
            key={r.id}
            center={[r.latitude, r.longitude]}
            radius={9}
            pathOptions={{ color: statusColor[r.status] || '#666', fillOpacity: 0.8 }}
          >
            <Popup>
              {r.city || 'Area'}{r.state ? `, ${r.state}` : ''}<br />
              Need: {formatNeed(r.need_type)} • {r.people_count} people<br />
              Status: {r.status}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
