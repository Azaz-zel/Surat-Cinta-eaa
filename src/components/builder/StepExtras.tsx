'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/image';
import { MAX_MUSIC_BYTES, MAX_PHOTO_BYTES, PETAL_COLORS } from '@/lib/letter/options';
import { ColorPicker } from './ColorPicker';
import type { StepProps } from './types';

export type MediaUrls = { musicUrl: string | null; photoUrl: string | null };

async function upload(userId: string, file: Blob, ext: string, contentType: string): Promise<{ path: string; url: string }> {
  const supabase = createClient();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file, { contentType, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = await supabase.storage.from('media').createSignedUrl(path, 60 * 60);
  return { path, url: data?.signedUrl ?? '' };
}

export function StepExtras({
  config,
  update,
  userId,
  media,
  setMedia,
}: StepProps & { userId: string; media: MediaUrls; setMedia: (m: MediaUrls) => void }) {
  const { extras } = config;
  const [busy, setBusy] = useState<'music' | 'photo' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setExtras = (patch: Partial<typeof extras>) => update((c) => ({ ...c, extras: { ...c.extras, ...patch } }));

  async function onMusic(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (file.type !== 'audio/mpeg') return setError('Musik harus berformat MP3.');
    if (file.size > MAX_MUSIC_BYTES) return setError('Musik maksimal 10 MB.');
    setBusy('music');
    try {
      const { path, url } = await upload(userId, file, 'mp3', 'audio/mpeg');
      setExtras({ musicPath: path });
      setMedia({ ...media, musicUrl: url });
    } catch {
      setError('Upload musik gagal. Coba lagi.');
    } finally {
      setBusy(null);
    }
  }

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith('image/')) return setError('Pilih file gambar.');
    setBusy('photo');
    try {
      const blob = await compressImage(file);
      if (blob.size > MAX_PHOTO_BYTES) throw new Error('too big');
      const { path, url } = await upload(userId, blob, 'jpg', 'image/jpeg');
      setExtras({ photoPath: path });
      setMedia({ ...media, photoUrl: url });
    } catch {
      setError('Upload foto gagal. Pastikan ukurannya di bawah 5 MB setelah dikompres, lalu coba lagi.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Ekstra</h2>
          <p className="muted">Semua opsional.</p>
        </div>
      </div>
      {error && <p className="alert alert-error" role="alert">{error}</p>}

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 className="subhead">Musik (MP3, maks. 10 MB)</h3>
        <p className="hint">Mulai diputar saat penerima mengetuk amplop.</p>
        {extras.musicPath && media.musicUrl && <audio controls src={media.musicUrl} style={{ width: '100%' }} />}
        <div className="media-row">
          <label className="btn btn-ghost">
            {busy === 'music' ? 'Mengupload…' : extras.musicPath ? 'Ganti musik' : 'Upload MP3'}
            <input type="file" accept="audio/mpeg,.mp3" className="sr-only" disabled={busy !== null} onChange={(e) => onMusic(e.target.files?.[0])} />
          </label>
          {extras.musicPath && (
            <button type="button" className="btn btn-danger" onClick={() => { setExtras({ musicPath: undefined }); setMedia({ ...media, musicUrl: null }); }}>
              Hapus musik
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 className="subhead">Foto (maks. 5 MB)</h3>
        <p className="hint">Tampil gaya polaroid di bawah surat. Foto dikecilkan dulu di browser sebelum diupload.</p>
        <div className="media-row">
          {extras.photoPath && media.photoUrl && <img className="media-thumb" src={media.photoUrl} alt="Foto terpilih" />}
          <label className="btn btn-ghost">
            {busy === 'photo' ? 'Mengupload…' : extras.photoPath ? 'Ganti foto' : 'Upload foto'}
            <input type="file" accept="image/*" className="sr-only" disabled={busy !== null} onChange={(e) => onPhoto(e.target.files?.[0])} />
          </label>
          {extras.photoPath && (
            <button type="button" className="btn btn-danger" onClick={() => { setExtras({ photoPath: undefined }); setMedia({ ...media, photoUrl: null }); }}>
              Hapus foto
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label className="toggle">
          <input
            type="checkbox"
            checked={extras.petals.enabled}
            onChange={(e) => setExtras({ petals: { ...extras.petals, enabled: e.target.checked } })}
          />
          Kelopak jatuh di latar
        </label>
        {extras.petals.enabled && (
          <ColorPicker
            label="Warna kelopak"
            value={extras.petals.color}
            presets={PETAL_COLORS}
            onChange={(color) => setExtras({ petals: { ...extras.petals, color } })}
          />
        )}
      </div>
    </>
  );
}
