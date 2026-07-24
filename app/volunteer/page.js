'use client'
import { useEffect, useState } from 'react'
import { getVolunteerIdentity, clearVolunteerIdentity } from '@/lib/volunteerIdentity'
import VolunteerForm from '@/components/VolunteerForm'
import VolunteerRequestList from '@/components/VolunteerRequestList'

export default function VolunteerPage() {
  const [volunteer, setVolunteer] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setVolunteer(getVolunteerIdentity())
    setChecked(true)
  }, [])

  const handleSwitchAccount = () => {
    clearVolunteerIdentity()
    setVolunteer(null)
  }

  if (!checked) return null

  if (!volunteer) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
          Volunteer Sign-Up
        </h1>
        <VolunteerForm onRegistered={setVolunteer} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
          <p className="text-sm text-gray-500">Signed in as {volunteer.name} • {volunteer.phone}</p>
        </div>
        <button onClick={handleSwitchAccount} className="text-sm text-red-600 underline">
          Not you? Switch
        </button>
      </div>
      <VolunteerRequestList volunteer={volunteer} />
    </main>
  )
}
