async function tryGeocode(query) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    if (data && data.length > 0) {
      return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) }
    }
    return null
  } catch (err) {
    console.error('Geocoding failed:', err)
    return null
  }
}

// Tries progressively simpler versions of the address until one resolves.
// Full detailed address is stored for display, but geocoding needs a cleaner query.
export async function geocodeLocation({ city, state, country }) {
  const attempts = [
    [city, state, country].filter(Boolean).join(', '),
    [city, country].filter(Boolean).join(', '),
    country
  ].filter(Boolean)

  for (const query of attempts) {
    const result = await tryGeocode(query)
    if (result) return result
  }
  return null
}
