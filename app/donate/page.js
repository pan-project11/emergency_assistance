import DonateClient from '../_client/DonateClient'

export const metadata = {
  title: 'Donate — Xohai',
  description: 'Donate items or funds to support emergency relief efforts, with the option to request pickup.',
}

export default function DonatePage() {
  return <DonateClient />
}
