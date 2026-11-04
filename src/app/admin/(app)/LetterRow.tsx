'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { deleteLetter } from '../actions';
import { copyText, letterUrl } from '@/lib/share';
import { ConfirmDialog } from '@/components/ConfirmDialog';

const dateFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export function LetterRow(props: {
  id: string;
  slug: string;
  recipient: string;
  updatedAt: string;
  envColor: string;
  sealColor: string;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  async function copy() {
    const ok = await copyText(letterUrl(props.slug));
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
  }

  function remove() {
    setError(null);
    startTransition(async () => {
      const res = await deleteLetter(props.id);
      // On success the list refreshes and this row unmounts with its dialog.
      if (!res.ok) {
        setConfirming(false);
        setError(res.error ?? 'Gagal menghapus.');
      }
    });
  }

  return (
    <li className="card letter-row">
      <span className="letter-thumb" aria-hidden="true" style={{ background: props.envColor }}>
        <span style={{ background: props.sealColor }} />
      </span>
      <div className="letter-meta">
        <p style={{ fontSize: 16, fontWeight: 600 }}>Untuk {props.recipient}</p>
        <p className="muted" style={{ fontSize: 13 }}>
          /s/{props.slug} · diubah {dateFormat.format(new Date(props.updatedAt))}
        </p>
        {error && <p className="alert alert-error" role="alert">{error}</p>}
      </div>
      <div className="letter-actions">
        <Link className="btn btn-ghost" href={`/admin/${props.id}`}>Edit</Link>
        <button className="btn btn-ghost" type="button" onClick={copy} aria-live="polite">
          {copied ? 'Tersalin' : 'Salin link'}
        </button>
        <button className="btn btn-danger" type="button" onClick={() => setConfirming(true)} disabled={pending} aria-label={`Hapus surat untuk ${props.recipient}`}>
          {pending ? 'Menghapus…' : 'Hapus'}
        </button>
      </div>
      <ConfirmDialog
        open={confirming}
        title={`Hapus surat untuk ${props.recipient}?`}
        message="Link-nya tidak bisa dibuka lagi, dan musik serta fotonya ikut terhapus. Ini tidak bisa dibatalkan."
        confirmLabel="Ya, hapus"
        pendingLabel="Menghapus…"
        pending={pending}
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      />
    </li>
  );
}
