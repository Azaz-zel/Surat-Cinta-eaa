import 'server-only';
import { cache } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { letterConfigSchema, type LetterConfig } from '@/lib/letter/schema';
import { SLUG_PATTERN } from '@/lib/slug';

const SIGNED_URL_SECONDS = 6 * 60 * 60;

export type PublicLetter = {
  recipientName: string;
  config: LetterConfig;
  musicUrl: string | null;
  photoUrl: string | null;
};

/**
 * Loads one letter for the public page with the service role, then signs its media.
 * Wrapped in React `cache` so generateMetadata and the page share one query.
 */
export const getPublicLetter = cache(async (slug: string): Promise<PublicLetter | null> => {
  if (!SLUG_PATTERN.test(slug)) return null;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('letters')
    .select('recipient_name, config')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return null;

  const parsed = letterConfigSchema.safeParse(data.config);
  if (!parsed.success) return null;
  const config = parsed.data;

  const sign = async (path?: string) => {
    if (!path) return null;
    const { data: signed } = await supabase.storage.from('media').createSignedUrl(path, SIGNED_URL_SECONDS);
    return signed?.signedUrl ?? null;
  };
  const [musicUrl, photoUrl] = await Promise.all([sign(config.extras.musicPath), sign(config.extras.photoPath)]);

  return { recipientName: data.recipient_name, config, musicUrl, photoUrl };
});
