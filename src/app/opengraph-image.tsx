import { ImageResponse } from 'next/og';

export const alt = 'Ada surat untukmu';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Static themed preview image. It never contains the letter itself. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
          background: '#3d0b18',
          color: '#fbf4ea',
        }}
      >
        <div style={{ position: 'relative', width: 420, height: 270, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#7a1b32', borderRadius: 10 }} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 0,
              height: 0,
              borderLeft: '210px solid transparent',
              borderRight: '210px solid transparent',
              borderTop: '150px solid #5a1224',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 172,
              top: 112,
              width: 76,
              height: 76,
              borderRadius: 38,
              background: '#a3132e',
              boxShadow: '0 6px 16px rgba(0,0,0,.35)',
            }}
          />
        </div>
        <div style={{ fontSize: 64, fontStyle: 'italic', letterSpacing: 1 }}>Ada surat untukmu</div>
      </div>
    ),
    size,
  );
}
