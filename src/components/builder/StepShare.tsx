'use client';
import { useState } from 'react';
import { copyText, letterUrl, shareLink } from '@/lib/share';
import { FONT_LABELS, PAPER_LABELS, RIBBON_LABELS, SEAL_LABELS, WRAP_LABELS } from '@/lib/letter/options';
import type { LetterConfig } from '@/lib/letter/schema';

/** True for plain-http links that aren't localhost, which recipients outside the owner's network usually can't open. */
function isPrivateHttp(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' && u.hostname !== 'localhost' && u.hostname !== '127.0.0.1';
  } catch {
    return false;
  }
}

export function StepShare({
  config,
  slug,
  saving,
  error,
  isEdit,
  dirty,
  onSave,
}: {
  config: LetterConfig;
  slug: string | null;
  saving: boolean;
  error: string | null;
  isEdit: boolean;
  dirty: boolean;
  onSave: () => void;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const url = slug ? letterUrl(slug) : null;
  const insecure = url !== null && isPrivateHttp(url);

  async function copy() {
    if (!url) return;
    setNotice((await copyText(url)) ? 'Link tersalin.' : 'Gagal menyalin. Salin manual dari kotak di atas.');
  }
  async function share() {
    if (!url) return;
    const res = await shareLink(url, config.letter.to);
    if (res === 'copied') setNotice('Link tersalin.');
  }

  const { bouquet, letter, envelope, extras } = config;
  const extrasText = [extras.musicPath && '1 lagu', extras.photoPath && '1 foto', extras.petals.enabled && 'kelopak jatuh']
    .filter(Boolean)
    .join(' · ') || 'Tidak ada';

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Simpan &amp; bagikan</h2>
          <p className="muted">{isEdit ? 'Perubahan tersimpan di link yang sama.' : 'Simpan dulu untuk mendapat link.'}</p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p className="brand" style={{ fontWeight: 500, fontSize: 24 }}>Untuk {letter.to || '…'}</p>
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '96px minmax(0,1fr)', rowGap: 10, columnGap: 12, fontSize: 14 }}>
          <dt className="muted">Buket</dt>
          <dd style={{ margin: 0 }}>{bouquet.flowers.length} tangkai · {WRAP_LABELS[bouquet.wrap.paper]} · {RIBBON_LABELS[bouquet.ribbon.style]}</dd>
          <dt className="muted">Surat</dt>
          <dd style={{ margin: 0 }}>{FONT_LABELS[letter.font]} · {PAPER_LABELS[letter.paper]}</dd>
          <dt className="muted">Amplop</dt>
          <dd style={{ margin: 0 }}>Stempel {SEAL_LABELS[envelope.seal].toLowerCase()}</dd>
          <dt className="muted">Ekstra</dt>
          <dd style={{ margin: 0 }}>{extrasText}</dd>
        </dl>
      </div>

      {error && <p className="alert alert-error" role="alert">{error}</p>}

      <button type="button" className="btn btn-primary" onClick={onSave} disabled={saving || (Boolean(slug) && !dirty)}>
        {saving ? 'Menyimpan…' : slug ? (dirty ? 'Simpan perubahan' : 'Tersimpan') : 'Generate link'}
      </button>

      {url && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="alert alert-success" style={{ padding: 0, background: 'none', fontWeight: 600, fontSize: 16 }}>Link siap dikirim</p>
          <label className="label" htmlFor="share-link">Link surat</label>
          <input id="share-link" className="input share-link" readOnly value={url} onFocus={(e) => e.currentTarget.select()} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10 }}>
            <button type="button" className="btn btn-primary" onClick={copy}>Salin link</button>
            <button type="button" className="btn btn-ghost" onClick={share}>Bagikan</button>
          </div>
          {insecure && (
            <p className="alert alert-error" role="status">
              Link ini masih http, jadi biasanya hanya bisa dibuka dari jaringanmu sendiri. Buka panel admin lewat alamat https
              (misalnya Tailscale Funnel atau domainmu), lalu salin link dari sana supaya bisa dibuka dari mana saja.
            </p>
          )}
          <p className="hint" aria-live="polite">{notice ?? 'Kalau suratnya diedit nanti, link-nya tetap sama.'}</p>
        </div>
      )}
    </>
  );
}
