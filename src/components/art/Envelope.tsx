import type { LetterConfig } from '@/lib/letter/schema';
import type { SealMotif } from '@/lib/letter/options';

export type EnvelopeStage = 'closed' | 'animate' | 'static';

function SealMotifArt({ motif, initial }: { motif: SealMotif; initial?: string }) {
  const common = { fill: 'rgba(0,0,0,.24)', stroke: 'rgba(255,255,255,.3)', strokeWidth: 1 };
  if (motif === 'initial') {
    return (
      <span className="seal-initial" aria-hidden="true">
        {(initial || '').slice(0, 2)}
      </span>
    );
  }
  const paths: Record<Exclude<SealMotif, 'initial'>, string> = {
    heart: 'M12 20.5s-7.5-4.4-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.8-7.5 10.2-7.5 10.2z',
    rose: 'M12 4.5a7.5 7.5 0 1 1 0 15a7.5 7.5 0 1 1 0-15zM12 8.2c-2.6 0-4 1.8-3.6 3.8c.4 1.8 2.6 2.5 4 1.4c1.2-.9.8-2.6-.5-2.8',
    star: 'M12 3.8l2.4 5.2l5.6.6l-4.2 3.8l1.2 5.6L12 16.2l-5 2.8l1.2-5.6L4 9.6l5.6-.6z',
    moon: 'M15.5 4.5a8 8 0 1 0 4 14.5a7 7 0 0 1-4-14.5z',
    infinity: 'M7.5 15.5c-2.2 0-3.7-1.6-3.7-3.5s1.5-3.5 3.7-3.5c3.4 0 5.6 7 9 7c2.2 0 3.7-1.6 3.7-3.5s-1.5-3.5-3.7-3.5c-3.4 0-5.6 7-9 7z',
  };
  const isLine = motif === 'rose' || motif === 'infinity';
  return (
    <svg aria-hidden="true" width="2.6em" height="2.6em" viewBox="0 0 24 24">
      <path d={paths[motif]} {...(isLine ? { fill: 'none', stroke: 'rgba(0,0,0,.32)', strokeWidth: 1.8, strokeLinecap: 'round' as const } : common)} />
    </svg>
  );
}

export function Envelope({
  envelope,
  recipient,
  stage,
}: {
  envelope: LetterConfig['envelope'];
  recipient: string;
  stage: EnvelopeStage;
}) {
  return (
    <div className={`envelope st-${stage}`}>
      <div className="env">
        <div className="env-back" style={{ backgroundColor: envelope.color }} />
        <div className="env-letter-wrap">
          <div className="env-letter">
            <p className="env-letter-to">Untuk {recipient},</p>
            <span className="env-line" style={{ width: '88%' }} />
            <span className="env-line" style={{ width: '72%' }} />
            <span className="env-line" style={{ width: '80%' }} />
          </div>
        </div>
        <div className="env-pocket" style={{ backgroundColor: envelope.color }}>
          <div className="env-pocket-shade" />
          <div className="env-pocket-shade-r" />
          <p className="env-name">Untuk {recipient}</p>
        </div>
        <div className="env-flap">
          <div className="env-face env-flap-front" style={{ backgroundColor: envelope.color }} />
          <div className={`env-face env-flap-back ${envelope.liner === 'pattern' ? 'liner-pattern' : 'liner-plain'}`} />
        </div>
        <div className="env-seal" style={{ backgroundColor: envelope.sealColor }}>
          <SealMotifArt motif={envelope.seal} initial={envelope.initial} />
          <svg className="env-crack" aria-hidden="true" viewBox="0 0 58 58">
            <path d="M29 2 L25 16 L32 24 L26 34 L31 44 L28 56" fill="none" stroke="rgba(20,0,6,.7)" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
