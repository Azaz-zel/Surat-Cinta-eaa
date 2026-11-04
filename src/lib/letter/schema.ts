import { z } from 'zod';
import {
  FLOWER_TYPES, GREENERY_TYPES, LETTER_FONTS, LETTER_PAPERS, MAX_STEMS, MIN_STEMS,
  RIBBON_STYLES, SEAL_MOTIFS, TEXT_SIZES, WRAP_PAPERS,
} from './options';

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Warna harus berformat #RRGGBB');

/** `<owner uuid>/<file name>` inside the private `media` bucket. */
export const mediaPathSchema = z
  .string()
  .max(200)
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[A-Za-z0-9._-]{1,120}$/, 'Path media tidak valid');

export const letterConfigSchema = z
  .object({
    bouquet: z.object({
      flowers: z
        .array(z.object({ type: z.enum(FLOWER_TYPES), color: hex }))
        .min(MIN_STEMS, `Minimal ${MIN_STEMS} tangkai`)
        .max(MAX_STEMS, `Maksimal ${MAX_STEMS} tangkai`),
      greenery: z.array(z.enum(GREENERY_TYPES)).max(GREENERY_TYPES.length),
      wrap: z.object({ paper: z.enum(WRAP_PAPERS), color: hex }),
      ribbon: z.object({ style: z.enum(RIBBON_STYLES), color: hex }),
      seed: z.number().int().min(0).max(0xffffffff),
    }),
    letter: z.object({
      to: z.string().trim().min(1, 'Nama penerima wajib diisi').max(60),
      body: z.string().trim().min(1, 'Isi surat wajib diisi').max(5000),
      from: z.string().trim().min(1, 'Nama pengirim wajib diisi').max(60),
      font: z.enum(LETTER_FONTS),
      paper: z.enum(LETTER_PAPERS),
      textSize: z.enum(TEXT_SIZES),
    }),
    envelope: z.object({
      color: hex,
      seal: z.enum(SEAL_MOTIFS),
      sealColor: hex,
      liner: z.enum(['plain', 'pattern']),
      initial: z.string().trim().max(2).optional(),
    }),
    extras: z.object({
      musicPath: mediaPathSchema.optional(),
      photoPath: mediaPathSchema.optional(),
      petals: z.object({ enabled: z.boolean(), color: hex }),
    }),
  })
  .superRefine((cfg, ctx) => {
    if (cfg.envelope.seal === 'initial' && !cfg.envelope.initial) {
      ctx.addIssue({ code: 'custom', path: ['envelope', 'initial'], message: 'Isi inisial untuk stempel inisial' });
    }
  });

export type LetterConfig = z.infer<typeof letterConfigSchema>;
