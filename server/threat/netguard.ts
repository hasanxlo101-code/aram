// حماية SSRF: لا يُسمح للخادم بالاتصال بعناوين داخلية/خاصة أبدًا
import dns from 'node:dns';
import net from 'node:net';
import { Agent } from 'undici';

export function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return (
      a === 0 || a === 10 || a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  if (net.isIPv6(ip)) {
    const l = ip.toLowerCase();
    if (l === '::1' || l === '::') return true;
    if (l.startsWith('fe80') || l.startsWith('fc') || l.startsWith('fd')) return true;
    if (l.startsWith('::ffff:')) return isPrivateIp(l.slice(7));
    return false;
  }
  return true;
}

// وكيل undici يتحقق من العنوان لحظة الاتصال الفعلي (يمنع DNS rebinding)
export const guardedAgent = new Agent({
  connect: {
    lookup: (hostname: string, options: any, cb: any) => {
      dns.lookup(hostname, { all: true, family: options?.family || 0 }, (err, addrs) => {
        if (err) return cb(err);
        const safe = (addrs as dns.LookupAddress[]).filter((a) => !isPrivateIp(a.address));
        if (!safe.length) return cb(new Error('BLOCKED_PRIVATE_ADDRESS'));
        if (options?.all) return cb(null, safe);
        cb(null, safe[0].address, safe[0].family);
      });
    },
  },
});

export interface Hop { url: string; status: number; location?: string }

export async function guardedFetch(
  url: string,
  opts: { method?: string; headers?: Record<string, string>; timeoutMs?: number; maxRedirects?: number } = {}
): Promise<{ finalUrl: string; status: number; headers: Headers; hops: Hop[] }> {
  const hops: Hop[] = [];
  let current = url;
  const max = opts.maxRedirects ?? 5;
  for (let i = 0; i <= max; i++) {
    const u = new URL(current);
    if (!['http:', 'https:'].includes(u.protocol)) throw new Error('UNSUPPORTED_PROTOCOL');
    if (net.isIP(u.hostname) && isPrivateIp(u.hostname)) throw new Error('BLOCKED_PRIVATE_ADDRESS');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 8000);
    try {
      const res = await fetch(current, {
        method: opts.method || 'GET',
        redirect: 'manual',
        signal: ctrl.signal,
        headers: { 'User-Agent': 'KAyA-SafeSec-Scanner/2.0 (+security-research)', Accept: '*/*', ...(opts.headers || {}) },
        // @ts-ignore dispatcher مدعوم في undici/node fetch
        dispatcher: guardedAgent,
      });
      const loc = res.headers.get('location') || undefined;
      hops.push({ url: current, status: res.status, location: loc });
      try { await res.body?.cancel(); } catch {}
      if (res.status >= 300 && res.status < 400 && loc) {
        current = new URL(loc, current).toString();
        continue;
      }
      return { finalUrl: current, status: res.status, headers: res.headers, hops };
    } finally {
      clearTimeout(timer);
    }
  }
  return { finalUrl: current, status: 0, headers: new Headers(), hops };
}

export function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}
