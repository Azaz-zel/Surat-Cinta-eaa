import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';
import { requireUser } from '@/lib/supabase/server';
import { letterConfigSchema } from '@/lib/letter/schema';
import { Builder } from '@/components/builder/Builder';

export const metadata: Metadata = { title: 'Edit surat · Surat Cinta' };

type Props = { params: Promise<{ id: string }> };

export default async function EditLetterPage({ params }: Props) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const { supabase, user } = await requireUser();
  if (!user) redirect('/admin/login');

  // RLS returns nothing for letters owned by someone else.
  const { data } = await supabase.from('letters').select('id, slug, config').eq('id', id).maybeSingle();
  if (!data) notFound();
  const parsed = letterConfigSchema.safeParse(data.config);
  if (!parsed.success) notFound();
  const config = parsed.data;

  const sign = async (path?: string) => {
    if (!path) return null;
    const { data: signed } = await supabase.storage.from('media').createSignedUrl(path, 60 * 60);
    return signed?.signedUrl ?? null;
  };
  const [musicUrl, photoUrl] = await Promise.all([sign(config.extras.musicPath), sign(config.extras.photoPath)]);

  return <Builder initialConfig={config} letterId={data.id} slug={data.slug} userId={user.id} initialMedia={{ musicUrl, photoUrl }} />;
}
