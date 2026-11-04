/**
 * Share links follow the address the admin is using right now, so opening the
 * admin through a public HTTPS address (Tailscale Funnel, Cloudflare Tunnel,
 * a domain) yields HTTPS links with no rebuild. NEXT_PUBLIC_SITE_URL is only a
 * fallback for code that runs outside the browser.
 */
export function letterUrl(slug: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL ?? '';
  return `${base.replace(/\/$/, '')}/s/${slug}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Web Share API where available (most phones), falling back to copying the link. */
export async function shareLink(url: string, recipient: string): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: `Ada surat untuk ${recipient} 💌`, url });
      return 'shared';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'failed';
    }
  }
  return (await copyText(url)) ? 'copied' : 'failed';
}
