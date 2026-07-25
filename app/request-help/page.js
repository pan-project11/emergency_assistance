import RequestHelpClient from '../_client/RequestHelpClient'

export const metadata = {
  title: 'Request help — Xohai',
  description: 'Submit an emergency request. Report your location and what kind of assistance you need — rescue, food, shelter, or medical.',
}

export default function RequestHelpPage() {
  return <RequestHelpClient />
}
