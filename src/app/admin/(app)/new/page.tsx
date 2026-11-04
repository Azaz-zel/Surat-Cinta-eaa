import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/supabase/server';
import { defaultConfig } from '@/lib/letter/defaults';
import { Builder } from '@/components/builder/Builder';

export const metadata: Metadata = { title: 'Surat baru · Surat Cinta' };

export default async function NewLetterPage() {
  const { user } = await requireUser();
  if (!user) redirect('/admin/login');
  return (
    <Builder
      initialConfig={defaultConfig()}
      letterId={null}
      slug={null}
      userId={user.id}
      initialMedia={{ musicUrl: null, photoUrl: null }}
    />
  );
}
