import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicLetter } from '@/lib/letters';
import { LetterExperience } from '@/components/letter/LetterExperience';

type Props = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const letter = await getPublicLetter(slug);
  if (!letter) return { title: 'Surat tidak ditemukan' };
  const title = `Ada surat untuk ${letter.recipientName} 💌`;
  // Only the recipient's name goes into the preview, never the letter content.
  return {
    title,
    description: 'Ketuk amplopnya untuk membuka.',
    openGraph: { title, description: 'Ketuk amplopnya untuk membuka.', type: 'website' },
    twitter: { card: 'summary_large_image', title },
  };
}

export default async function LetterPage({ params }: Props) {
  const { slug } = await params;
  const letter = await getPublicLetter(slug);
  if (!letter) notFound();
  return <LetterExperience config={letter.config} musicUrl={letter.musicUrl} photoUrl={letter.photoUrl} />;
}
