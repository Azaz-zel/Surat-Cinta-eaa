const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

/** 10 random URL-safe characters (60 bits). 64 symbols divide 256 evenly, so there is no modulo bias. */
export function generateSlug(length = 10): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += ALPHABET[b % 64];
  return out;
}

export const SLUG_PATTERN = /^[A-Za-z0-9_-]{10}$/;
