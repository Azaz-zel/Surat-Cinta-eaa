export function supabaseUrl(): string {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!v) throw new Error('NEXT_PUBLIC_SUPABASE_URL belum diisi (lihat .env.example)');
  return v;
}

export function supabaseAnonKey(): string {
  const v = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!v) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi (lihat .env.example)');
  return v;
}
