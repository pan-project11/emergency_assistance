import VolunteerPortalClient from '../_client/VolunteerPortalClient'

export const metadata = {
  title: 'Volunteer portal — Xohai',
  robots: { index: false, follow: false },
}

export default function VolunteerPage() {
  return <VolunteerPortalClient />
}
