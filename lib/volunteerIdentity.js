export function getVolunteerIdentity() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('volunteer_identity')
  return raw ? JSON.parse(raw) : null
}

export function setVolunteerIdentity(identity) {
  if (typeof window === 'undefined') return
  localStorage.setItem('volunteer_identity', JSON.stringify(identity))
}

export function clearVolunteerIdentity() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('volunteer_identity')
}
