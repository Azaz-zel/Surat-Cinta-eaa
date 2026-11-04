import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
const { allow, clientIp } = await import('./rate-limit');

describe('allow', () => {
  it('allows up to the limit, then blocks until the window resets', () => {
    vi.useFakeTimers();
    for (let i = 0; i < 3; i++) expect(allow('k1', 3, 1000)).toBe(true);
    expect(allow('k1', 3, 1000)).toBe(false);
    expect(allow('k2', 3, 1000)).toBe(true);
    vi.advanceTimersByTime(1001);
    expect(allow('k1', 3, 1000)).toBe(true);
    vi.useRealTimers();
  });
});

describe('clientIp', () => {
  it('prefers Cloudflare, then the first forwarded address', () => {
    expect(clientIp(new Headers({ 'cf-connecting-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2' }))).toBe('1.1.1.1');
    expect(clientIp(new Headers({ 'x-forwarded-for': '3.3.3.3, 10.0.0.1' }))).toBe('3.3.3.3');
    expect(clientIp(new Headers())).toBe('unknown');
  });
});
