import HomeClient from './_client/HomeClient'

export const metadata = {
  title: 'Xohai — Emergency Assistance',
  description: 'Report an urgent need, offer to help, or track relief efforts in your area. Xohai connects people who need help with volunteers who can provide it.',
}

export default function Home() {
  return <HomeClient />
}
