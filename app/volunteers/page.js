import VolunteersClient from '../_client/VolunteersClient'

export const metadata = {
  title: 'Find volunteers — Xohai',
  description: 'Browse registered volunteers by area and contact them directly for help.',
}

export default function VolunteersPage() {
  return <VolunteersClient />
}
