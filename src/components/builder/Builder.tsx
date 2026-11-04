'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { saveLetter } from '@/app/admin/actions';
import { letterConfigSchema, type LetterConfig } from '@/lib/letter/schema';
import { Bouquet } from '@/components/art/Bouquet';
import { Envelope } from '@/components/art/Envelope';
import { LetterPaper } from '@/components/letter/LetterPaper';
import { LetterExperience } from '@/components/letter/LetterExperience';
import { StepFlowers } from './StepFlowers';
import { StepWrap } from './StepWrap';
import { StepLetter } from './StepLetter';
import { StepEnvelope } from './StepEnvelope';
import { StepExtras, type MediaUrls } from './StepExtras';
import { StepShare } from './StepShare';
import { STEP_LABELS, type Update } from './types';

const STEP_OF_SECTION: Record<string, number> = { bouquet: 1, letter: 3, envelope: 4, extras: 5 };

function draftKey(id: string | null) {
  return `surat-draft:${id ?? 'new'}`;
}

function readDraft(id: string | null): LetterConfig | null {
  try {
    const raw = localStorage.getItem(draftKey(id));
    if (!raw) return null;
    const draft = JSON.parse(raw) as LetterConfig;
    return draft && draft.bouquet && draft.letter && draft.envelope && draft.extras ? draft : null;
  } catch {
    return null;
  }
}

export function Builder({
  initialConfig,
  letterId,
  slug: initialSlug,
  userId,
  initialMedia,
}: {
  initialConfig: LetterConfig;
  letterId: string | null;
  slug: string | null;
  userId: string;
  initialMedia: MediaUrls;
}) {
  const [config, setConfig] = useState(initialConfig);
  const [step, setStep] = useState(1);
  const [id, setId] = useState(letterId);
  const [slug, setSlug] = useState(initialSlug);
  const [media, setMedia] = useState(initialMedia);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [replay, setReplay] = useState(0);
  const restored = useRef(false);

  // Restore an unsaved draft once, after hydration (localStorage is browser-only).
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const draft = readDraft(letterId);
    if (draft) {
      setConfig(draft);
      setDirty(true);
    }
  }, [letterId]);

  // Autosave the draft while the builder is open.
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey(id), JSON.stringify(config));
      } catch {
        // Storage full or blocked: the builder still works, the draft just isn't kept.
      }
    }, 400);
    return () => clearTimeout(t);
  }, [config, dirty, id]);

  const update: Update = useCallback((fn) => {
    setConfig((c) => fn(c));
    setDirty(true);
    setError(null);
  }, []);

  async function save() {
    const parsed = letterConfigSchema.safeParse(config);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setError(issue?.message ?? 'Ada isian yang belum lengkap.');
      const target = STEP_OF_SECTION[String(issue?.path[0])];
      if (target && target !== 6) setStep(target);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await saveLetter({ id: id ?? undefined, config: parsed.data });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      try {
        localStorage.removeItem(draftKey(id));
        localStorage.removeItem(draftKey(res.id));
      } catch {}
      setSlug(res.slug);
      setDirty(false);
      if (!id) {
        setId(res.id);
        window.history.replaceState(null, '', `/admin/${res.id}`);
      }
      setStep(6);
    } catch {
      setError('Gagal menyimpan. Periksa koneksi lalu coba lagi. Isianmu tidak hilang.');
    } finally {
      setSaving(false);
    }
  }

  const stepProps = { config, update };
  const title = config.letter.to ? `untuk ${config.letter.to}` : '';

  return (
    <>
      <div className="admin-header" style={{ borderTop: 0 }}>
        <div className="admin-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', minWidth: 0 }}>
            <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, fontSize: 14, textDecoration: 'none' }}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              Daftar surat
            </Link>
            <h1 className="page-title" style={{ fontSize: 20 }}>
              {id ? 'Edit surat' : 'Surat baru'} {title && <span style={{ color: 'var(--burgundy)' }}>{title}</span>}
            </h1>
          </div>
          <span className="hint">{dirty ? 'Draft tersimpan di perangkat ini' : slug ? 'Tersimpan' : ''}</span>
        </div>
        <nav aria-label="Langkah builder" className="builder-steps">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            return (
              <button
                key={label}
                type="button"
                className={n < step ? 'step step-done' : 'step'}
                aria-current={n === step ? 'step' : undefined}
                aria-label={`Langkah ${n}: ${label}`}
                onClick={() => setStep(n)}
              >
                <span className="step-bar" />
                <span className="step-label">{n}. {label}</span>
              </button>
            );
          })}
        </nav>
        <p className="step-current-mobile">Langkah {step} dari 6 · {STEP_LABELS[step - 1]}</p>
      </div>

      <main className="builder-main">
        <section className="builder-panel" aria-label={STEP_LABELS[step - 1]}>
          {step === 1 && <StepFlowers {...stepProps} />}
          {step === 2 && <StepWrap {...stepProps} />}
          {step === 3 && <StepLetter {...stepProps} />}
          {step === 4 && <StepEnvelope {...stepProps} />}
          {step === 5 && <StepExtras {...stepProps} userId={userId} media={media} setMedia={setMedia} />}
          {step === 6 && (
            <StepShare config={config} slug={slug} saving={saving} error={error} isEdit={Boolean(id)} dirty={dirty} onSave={save} />
          )}
          {step !== 6 && error && <p className="alert alert-error" role="alert">{error}</p>}

          <div className="panel-footer">
            {step > 1 ? (
              <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>Kembali</button>
            ) : (
              <span />
            )}
            {step < 6 && (
              <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
                Lanjut: {STEP_LABELS[step]}
              </button>
            )}
          </div>
        </section>

        <section className={previewOpen ? 'builder-preview is-open' : 'builder-preview'} aria-label="Preview langsung">
          <div className="preview-head">
            <p className="preview-label">Preview langsung</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {step >= 5 && (
                <button type="button" className="btn btn-ghost" onClick={() => setReplay((r) => r + 1)}>Putar dari amplop</button>
              )}
              <button type="button" className="btn btn-ghost preview-close" onClick={() => setPreviewOpen(false)}>Tutup preview</button>
            </div>
          </div>
          {step <= 2 && (
            <div className="preview-stage">
              <div style={{ width: '100%', maxWidth: 380 }}>
                <Bouquet bouquet={config.bouquet} />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="preview-stage preview-stage-dark texture">
              <div className="preview-letter">
                <LetterPaper config={config} photoUrl={media.photoUrl} bloom={false} />
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="preview-stage preview-stage-dark texture" style={{ padding: '48px 12px' }}>
              <Envelope envelope={config.envelope} recipient={config.letter.to || '…'} stage="closed" />
            </div>
          )}
          {step >= 5 && (
            <div className="preview-phone">
              <LetterExperience key={replay} config={config} musicUrl={media.musicUrl} photoUrl={media.photoUrl} preview />
            </div>
          )}
          {step <= 2 && (
            <p className="hint" style={{ textAlign: 'center' }}>Susunan memakai seed, jadi buket yang sama selalu tersusun sama.</p>
          )}
        </section>
      </main>

      <div className="preview-fab">
        <button type="button" className="btn btn-ghost btn-block" onClick={() => setPreviewOpen(true)}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
          Lihat preview
        </button>
      </div>
    </>
  );
}
