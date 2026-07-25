import AdminClient from '../_client/AdminClient'

export const metadata = {
  title: 'Admin — Xohai',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminClient />
}
