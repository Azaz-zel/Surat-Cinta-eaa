'use client';
import { useEffect, useRef, useState } from 'react';
import type { LetterConfig } from '@/lib/letter/schema';
import { Envelope } from '@/components/art/Envelope';
import { LetterPaper } from './LetterPaper';
import { Petals } from './Petals';

type Phase = 'closed' | 'opening' | 'open';

const OPEN_MS = 2500;
const OPEN_MS_REDUCED = 900;

export function LetterExperience({
  config,
  musicUrl,
  photoUrl,
  preview = false,
}: {
  config: LetterConfig;
  musicUrl?: string | null;
  photoUrl?: string | null;
  /** In the builder preview the experience sits inside a box instead of the full viewport. */
  preview?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>('closed');
  const [musicOn, setMusicOn] = useState(true);
  const [musicFailed, setMusicFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const hasMusic = Boolean(musicUrl) && !musicFailed;

  function open() {
    if (phase !== 'closed') return;
    setPhase('opening');
    // Mobile browsers only allow audio to start inside a user gesture, so start it on this tap.
    if (hasMusic && musicOn && audioRef.current) {
      audioRef.current.play().catch(() => setMusicFailed(true));
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = setTimeout(() => setPhase('open'), reduced ? OPEN_MS_REDUCED : OPEN_MS);
  }

  function close() {
    clearTimeout(timer.current);
    setPhase('closed');
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    } else {
      audio.play().catch(() => setMusicFailed(true));
      setMusicOn(true);
    }
  }

  return (
    <div className={preview ? 'experience experience-preview texture' : 'experience texture'}>
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" onError={() => setMusicFailed(true)} />
      )}

      {phase !== 'open' ? (
        <div className="cover">
          <div className="cover-head">
            <p className="eyebrow">Ada surat untukmu</p>
            <h1 className="cover-title">Untuk {config.letter.to || '…'}</h1>
          </div>
          <button type="button" className="envelope-button" aria-label="Buka surat" onClick={open}>
            <Envelope envelope={config.envelope} recipient={config.letter.to} stage={phase === 'closed' ? 'closed' : 'animate'} />
          </button>
          <p className={`tap-hint tap-${phase}`}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
              <path d="M12 10.5V9a1.5 1.5 0 0 1 3 0v2" />
              <path d="M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2L4.6 16a1.6 1.6 0 0 1 2.4-2.1L9 15.5" />
            </svg>
            ketuk untuk membuka
          </p>
        </div>
      ) : (
        <div className="opened">
          {config.extras.petals.enabled && <Petals color={config.extras.petals.color} />}
          <div className="controls">
            {hasMusic ? (
              <button
                type="button"
                className="ctl ctl-icon"
                aria-label={musicOn ? 'Matikan musik' : 'Nyalakan musik'}
                aria-pressed={musicOn}
                onClick={toggleMusic}
              >
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l11-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="17" cy="16" r="3" />
                  {!musicOn && <path d="M3 3l18 18" />}
                </svg>
              </button>
            ) : (
              <span />
            )}
            <button type="button" className="ctl" onClick={close}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              Tutup surat
            </button>
          </div>
          <div className="opened-body reveal">
            <LetterPaper config={config} photoUrl={photoUrl} />
          </div>
        </div>
      )}
    </div>
  );
}
