import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/supabase/server';
import { LetterRow } from './LetterRow';

export const metadata: Metadata = { title: 'Daftar surat · Surat Cinta' };
export const dynamic = 'force-dynamic';

type Row = {
  id: string;
  slug: string;
  recipient_name: string;
  updated_at: string;
  config: { envelope?: { color?: string; sealColor?: string } };
};

export default async function AdminHome() {
  const { supabase, user } = await requireUser();
  if (!user) redirect('/admin/login');

  const { data, error } = await supabase
    .from('letters')
    .select('id, slug, recipient_name, updated_at, config')
    .order('updated_at', { ascending: false });
  const letters = (data ?? []) as Row[];

  return (
    <main className="admin-main">
      <div className="section-head">
        <div>
          <h1 className="page-title">Surat kamu</h1>
          <p className="muted" style={{ margin: '6px 0 0' }}>Edit kapan saja. Link yang sudah dikirim tidak berubah.</p>
        </div>
        <Link className="btn btn-primary" href="/admin/new">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Surat baru
        </Link>
      </div>

      {error && <p className="alert alert-error" role="alert">Gagal memuat daftar surat. Muat ulang halaman.</p>}

      {!error && letters.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ margin: '0 0 16px' }}>Belum ada surat. Yuk buat yang pertama.</p>
          <Link className="btn btn-primary" href="/admin/new">Buat surat</Link>
        </div>
      ) : (
        <ul className="letter-list">
          {letters.map((l) => (
            <LetterRow
              key={l.id}
              id={l.id}
              slug={l.slug}
              recipient={l.recipient_name}
              updatedAt={l.updated_at}
              envColor={l.config.envelope?.color ?? '#7A1B32'}
              sealColor={l.config.envelope?.sealColor ?? '#A3132E'}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
