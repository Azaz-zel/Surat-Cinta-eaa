import type { LetterConfig } from '@/lib/letter/schema';

export type Update = (fn: (c: LetterConfig) => LetterConfig) => void;

export type StepProps = { config: LetterConfig; update: Update };

export const STEP_LABELS = ['Bunga', 'Daun & wrapping', 'Surat', 'Amplop', 'Ekstra', 'Simpan & bagikan'] as const;
