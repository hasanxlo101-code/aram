import dns from 'node:dns/promises';
import net from 'node:net';
import { isPrivateIp } from './netguard.js';
import type { SourceResult } from './types.js';

let torCache: { t: number; set: Set<string> } | null = null;
async function torExit(ip: string): Promise<SourceResult> {
  const base = { id: 'tor', name: 'قائمة عقد خروج Tor' };
  try {
    if (!torCache || Date.now() - torCache.t > 3600_000) {
      const r = await fetch('https://check.torproject.org/torbulkexitlist', { signal: AbortSignal.timeout(10000) });
      if (!r.ok) throw new Error('x');
      torCache = { t: Date.now(), set: new Set((await r.text()).split('\n').map(s => s.trim()).filter(Boolean)) };
    }
    const hit = torCache.set.has(ip);
    return { ...base, status: 'ok', flagged: hit, detail: hit ? 'عقدة خروج Tor' : 'ليست عقدة خروج' };
  } catch { return { ...base, status: 'unavailable', detail: 'تعذّر جلب القائمة' }; }
}

export async function analyzeIp(raw: string) {
  const ip = (raw || '').trim();
  if (!net.isIP(ip)) throw new Error('INVALID_INPUT');
  if (isPrivateIp(ip)) return { blocked: true, reason: 'عنوان خاص/داخلي: لا توجد معلومات عامة عنه.' };

  const [rdns, geo, tor, abuse] = await Promise.all([
    dns.reverse(ip).catch(() => [] as string[]),
    (async () => {
      try {
        const r = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { signal: AbortSignal.timeout(8000) });
        const j: any = await r.json();
        if (!j.success) return null;
        return { country: j.country, countryCode: j.country_code, region: j.region, city: j.city, asn: j.connection?.asn, org: j.connection?.org, isp: j.connection?.isp, domain: j.connection?.domain };
      } catch { return null; }
    })(),
    torExit(ip),
    (async (): Promise<SourceResult & { score?: number; reports?: number; usage?: string }> => {
      const base = { id: 'abuseipdb', name: 'AbuseIPDB' };
      const key = process.env.ABUSEIPDB_KEY;
      if (!key) return { ...base, status: 'not_configured', detail: 'مفتاح ABUSEIPDB_KEY غير مضبوط' };
      try {
        const r = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90`, { headers: { Key: key, Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
        if (!r.ok) throw new Error('x');
        const d: any = (await r.json()).data;
        return { ...base, status: 'ok', flagged: d.abuseConfidenceScore >= 50, score: d.abuseConfidenceScore, reports: d.totalReports, usage: d.usageType, detail: `ثقة الإساءة ${d.abuseConfidenceScore}% (${d.totalReports} بلاغ خلال 90 يومًا)` };
      } catch { return { ...base, status: 'unavailable', detail: 'فشل الاتصال' }; }
    })(),
  ]);

  const answered = [tor, abuse].filter(s => s.status === 'ok');
  const verdict = answered.some(s => s.flagged) ? 'flagged' : answered.length ? 'no_known_threat' : 'inconclusive';
  return { ip, reverseDns: rdns, geo, sources: [tor, abuse], verdict, checkedAt: new Date().toISOString() };
}
