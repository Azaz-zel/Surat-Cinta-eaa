'use client';
import { useState } from 'react';
import type { LetterConfig } from '@/lib/letter/schema';
import { FONT_CSS, TEXT_SIZE_PX } from '@/lib/letter/options';
import { Bouquet } from '@/components/art/Bouquet';

/** The open letter: bouquet, words and optional polaroid. Shared by the recipient page and the builder preview. */
export function LetterPaper({
  config,
  photoUrl,
  bloom = true,
}: {
  config: LetterConfig;
  photoUrl?: string | null;
  bloom?: boolean;
}) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const { letter } = config;
  const font = FONT_CSS[letter.font];
  const bodySize = Math.round(TEXT_SIZE_PX[letter.textSize] * font.scale);

  return (
    <div className="letter-stack">
      <article className={`paper paper-${letter.paper}`}>
        <div className="paper-bouquet">
          <Bouquet bouquet={config.bouquet} bloom={bloom} />
        </div>
        <p className="paper-to" style={{ fontFamily: font.family, fontSize: Math.round(34 * font.scale + 4) }}>
          Untuk {letter.to || '…'},
        </p>
        <p className="paper-body" style={{ fontFamily: font.family, fontSize: bodySize }}>
          {letter.body || 'Isi suratmu akan muncul di sini.'}
        </p>
        <p className="paper-from" style={{ fontFamily: font.family, fontSize: Math.round(30 * font.scale + 3) }}>
          Dari, {letter.from || '…'}
        </p>
      </article>
      {photoUrl && !photoFailed && (
        <figure className="polaroid">
          <img src={photoUrl} alt="Foto kenangan" onError={() => setPhotoFailed(true)} />
        </figure>
      )}
    </div>
  );
}
