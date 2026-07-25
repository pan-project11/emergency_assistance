import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0B1F35',
        }}
      >
        <div style={{ color: '#F09595', fontSize: 22, letterSpacing: 4, marginBottom: 20 }}>
          EMERGENCY RESPONSE NETWORK
        </div>
        <div style={{ color: '#ffffff', fontSize: 72, fontWeight: 600, lineHeight: 1.15, maxWidth: 900 }}>
          Xohai
        </div>
        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 28, marginTop: 20, maxWidth: 800 }}>
          Get help. Give help. Make every response count.
        </div>
      </div>
    ),
    { ...size }
  )
}
