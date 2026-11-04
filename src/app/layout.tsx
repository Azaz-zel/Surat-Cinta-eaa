import type { Metadata, Viewport } from 'next';
import { Caveat, Cormorant_Garamond, Dancing_Script, DM_Sans, Great_Vibes, Homemade_Apple, Kalam } from 'next/font/google';
import { ArtDefs } from '@/components/art/ArtDefs';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-dmsans' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--font-cormorant' });
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-caveat' });
const dancing = Dancing_Script({ subsets: ['latin'], weight: ['500'], variable: '--font-dancing' });
const homemade = Homemade_Apple({ subsets: ['latin'], weight: ['400'], variable: '--font-homemade' });
const greatVibes = Great_Vibes({ subsets: ['latin'], weight: ['400'], variable: '--font-greatvibes' });
const kalam = Kalam({ subsets: ['latin'], weight: ['400'], variable: '--font-kalam' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Surat Cinta',
  description: 'Surat cinta digital dengan buket bunga.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#3d0b18',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [dmSans, cormorant, caveat, dancing, homemade, greatVibes, kalam].map((f) => f.variable).join(' ');
  return (
    <html lang="id" className={fonts}>
      <body>
        <ArtDefs />
        {children}
      </body>
    </html>
  );
}
