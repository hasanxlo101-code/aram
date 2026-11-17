import type { SourceResult } from './types.js';

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

export async function checkEmailBreach(email: string) {
  const e = (email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(e) || e.length > 320) throw new Error('INVALID_INPUT');

  const hibpKey = process.env.HIBP_API_KEY;
  const sources: SourceResult[] = [];
  let breaches: { name: string; date?: string; dataClasses?: string[]; description?: string }[] | null = null;

  if (hibpKey) {
    try {
      const res = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(e)}?truncateResponse=false`, {
        headers: { 'hibp-api-key': hibpKey, 'user-agent': 'KAyA-SafeSec' }, signal: AbortSignal.timeout(9000),
      });
      if (res.status === 404) { breaches = []; sources.push({ id: 'hibp', name: 'Have I Been Pwned', status: 'ok', flagged: false, detail: 'لا تسريبات' }); }
      else if (res.ok) {
        const j: any[] = await res.json();
        breaches = j.map(b => ({ name: b.Title || b.Name, date: b.BreachDate, dataClasses: b.DataClasses, description: (b.Description || '').replace(/<[^>]+>/g, '').slice(0, 280) }));
        sources.push({ id: 'hibp', name: 'Have I Been Pwned', status: 'ok', flagged: j.length > 0, detail: `${j.length} تسريب` });
      } else sources.push({ id: 'hibp', name: 'Have I Been Pwned', status: 'unavailable', detail: `HTTP ${res.status}` });
    } catch { sources.push({ id: 'hibp', name: 'Have I Been Pwned', status: 'unavailable', detail: 'فشل الاتصال' }); }
  } else {
    sources.push({ id: 'hibp', name: 'Have I Been Pwned', status: 'not_configured', detail: 'مفتاح HIBP_API_KEY غير مضبوط' });
  }

  if (breaches === null) {
    try {
      const res = await fetch(`https://api.xposedornot.com/v1/check-email/${encodeURIComponent(e)}`, { signal: AbortSignal.timeout(9000), headers: { 'user-agent': 'KAyA-SafeSec' } });
      if (res.status === 404) { breaches = []; sources.push({ id: 'xon', name: 'XposedOrNot', status: 'ok', flagged: false, detail: 'لا تسريبات' }); }
      else if (res.ok) {
        const j: any = await res.json();
        const names: string[] = (j.breaches || []).flat().filter((x: any) => typeof x === 'string');
        breaches = names.map(n => ({ name: n }));
        sources.push({ id: 'xon', name: 'XposedOrNot', status: 'ok', flagged: names.length > 0, detail: `${names.length} تسريب` });
      } else sources.push({ id: 'xon', name: 'XposedOrNot', status: 'unavailable', detail: `HTTP ${res.status}` });
    } catch { sources.push({ id: 'xon', name: 'XposedOrNot', status: 'unavailable', detail: 'فشل الاتصال' }); }
  }

  const answered = breaches !== null;
  return {
    emailMasked: e.replace(/^(.).*(@.*)$/, '$1***$2'),
    status: answered ? (breaches!.length ? 'exposed' : 'not_found') : 'unavailable',
    breaches: breaches || [],
    sources,
    checkedAt: new Date().toISOString(),
  };
}
