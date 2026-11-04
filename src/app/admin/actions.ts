'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient, requireUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { letterConfigSchema } from '@/lib/letter/schema';
import { MAX_MUSIC_BYTES, MAX_PHOTO_BYTES } from '@/lib/letter/options';
import { generateSlug } from '@/lib/slug';
import { registrationOpen } from '@/lib/registration';
import { allow, clientIp } from '@/lib/rate-limit';

export type LoginState = { error?: string; email?: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Email dan password wajib diisi.', email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Email atau password salah.', email };
  redirect('/admin');
}

/** Returned values refill the form, since React resets it after the action runs. Passwords are never echoed back. */
export type RegisterState = { error?: string; email?: string };

const registerSchema = z
  .object({
    email: z.string().trim().email('Format email tidak valid.'),
    password: z.string().min(8, 'Password minimal 8 karakter.').max(72, 'Password maksimal 72 karakter.'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: 'Konfirmasi password tidak sama.', path: ['confirm'] });

const REGISTER_LIMIT = 5;
const REGISTER_WINDOW_MS = 60 * 60 * 1000;

/** Open sign-up, guarded by a per-IP rate limit and a honeypot field that only bots fill in. */
export async function register(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  if (!registrationOpen()) return { error: 'Pendaftaran sedang ditutup.' };

  const echo = { email: String(formData.get('email') ?? '') };
  if (String(formData.get('website') ?? '') !== '') return { error: 'Gagal membuat akun. Coba lagi.', ...echo };

  const parsed = registerSchema.safeParse({
    email: formData.get('email') ?? '',
    password: formData.get('password') ?? '',
    confirm: formData.get('confirm') ?? '',
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Data belum lengkap.', ...echo };
  const { email, password } = parsed.data;
  // Counted only once the form is valid, so typos don't use up the allowance.
  if (!allow(`register:${clientIp(await headers())}`, REGISTER_LIMIT, REGISTER_WINDOW_MS)) {
    return { error: 'Terlalu banyak percobaan daftar. Coba lagi sekitar satu jam lagi.', ...echo };
  }

  // Created with the service role so it works even with public sign-ups disabled in Supabase,
  // and without a confirmation email.
  const { error } = await createAdminClient().auth.admin.createUser({ email, password, email_confirm: true });
  if (error) {
    const taken = error.status === 422 || /already/i.test(error.message);
    return { error: taken ? 'Email ini sudah terdaftar. Silakan masuk.' : 'Gagal membuat akun. Coba lagi.', ...echo };
  }

  const supabase = await createClient();
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) redirect('/admin/login');
  redirect('/admin');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export type SaveResult = { ok: true; id: string; slug: string } | { ok: false; error: string };

const uuid = z.string().uuid();

/** Checks an uploaded file's real size and type in Storage, so the browser-side limit can't be bypassed. */
async function checkMedia(path: string, ownerId: string, kind: 'music' | 'photo'): Promise<string | null> {
  if (!path.startsWith(`${ownerId}/`)) return 'File media bukan milikmu.';
  const [folder, name] = path.split('/');
  const { data, error } = await createAdminClient().storage.from('media').list(folder, { search: name, limit: 5 });
  const file = data?.find((f) => f.name === name);
  if (error || !file) return 'File media tidak ditemukan. Coba upload ulang.';
  const size = Number(file.metadata?.size ?? 0);
  const type = String(file.metadata?.mimetype ?? '');
  if (kind === 'music') {
    if (type !== 'audio/mpeg') return 'Musik harus berformat MP3.';
    if (size > MAX_MUSIC_BYTES) return 'Musik maksimal 10 MB.';
  } else {
    if (!type.startsWith('image/')) return 'Foto harus berupa gambar.';
    if (size > MAX_PHOTO_BYTES) return 'Foto maksimal 5 MB.';
  }
  return null;
}

export async function saveLetter(input: { id?: string; config: unknown }): Promise<SaveResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: 'Sesi habis. Silakan login lagi.' };

  const parsed = letterConfigSchema.safeParse(input.config);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Data surat tidak valid.' };
  }
  const config = parsed.data;

  for (const [path, kind] of [
    [config.extras.musicPath, 'music'],
    [config.extras.photoPath, 'photo'],
  ] as const) {
    if (!path) continue;
    const problem = await checkMedia(path, user.id, kind);
    if (problem) return { ok: false, error: problem };
  }

  const recipient_name = config.letter.to;

  if (input.id) {
    if (!uuid.safeParse(input.id).success) return { ok: false, error: 'Surat tidak ditemukan.' };
    // RLS limits the update to the owner's own row; the slug is never changed.
    const { data, error } = await supabase
      .from('letters')
      .update({ config, recipient_name })
      .eq('id', input.id)
      .select('id, slug')
      .maybeSingle();
    if (error) return { ok: false, error: 'Gagal menyimpan. Coba lagi.' };
    if (!data) return { ok: false, error: 'Surat tidak ditemukan.' };
    revalidatePath('/admin');
    return { ok: true, id: data.id, slug: data.slug };
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
      .from('letters')
      .insert({ slug: generateSlug(), owner_id: user.id, config, recipient_name })
      .select('id, slug')
      .single();
    if (!error && data) {
      revalidatePath('/admin');
      return { ok: true, id: data.id, slug: data.slug };
    }
    if (error?.code !== '23505') break; // retry only on a slug collision
  }
  return { ok: false, error: 'Gagal menyimpan. Coba lagi.' };
}

export async function deleteLetter(id: string): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: 'Sesi habis. Silakan login lagi.' };
  if (!uuid.safeParse(id).success) return { ok: false, error: 'Surat tidak ditemukan.' };

  const { data, error } = await supabase.from('letters').delete().eq('id', id).select('config').maybeSingle();
  if (error) return { ok: false, error: 'Gagal menghapus. Coba lagi.' };

  // Clean up the letter's media. Failures here don't block the delete.
  const extras = (data?.config as { extras?: { musicPath?: string; photoPath?: string } } | null)?.extras;
  const paths = [extras?.musicPath, extras?.photoPath].filter((p): p is string => Boolean(p));
  if (paths.length) await supabase.storage.from('media').remove(paths);

  revalidatePath('/admin');
  return { ok: true };
}
