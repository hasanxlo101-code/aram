import { guardedFetch } from './netguard.js';
import { normalizeUrl } from './url.js';

interface Item { id: string; name: string; weight: number; status: 'pass' | 'warn' | 'fail'; value: string | null; adviceAr: string }

export async function auditHeaders(raw: string) {
  const u = normalizeUrl(raw);
  const r = await guardedFetch(u.toString(), { method: 'GET', timeoutMs: 9000 });
  const h = r.headers;
  const get = (k: string) => h.get(k);
  const items: Item[] = [];

  const csp = get('content-security-policy');
  items.push({ id: 'csp', name: 'Content-Security-Policy', weight: 25,
    status: !csp ? 'fail' : /unsafe-inline|unsafe-eval|\*/.test(csp) && !/nonce-|sha256-/.test(csp) ? 'warn' : 'pass', value: csp,
    adviceAr: !csp ? 'أضف CSP لتقليل أثر XSS (ابدأ بـ default-src \'self\').' : 'سياسة موجودة؛ تجنب unsafe-inline/unsafe-eval قدر الإمكان.' });

  const hsts = get('strict-transport-security');
  const maxAge = Number(/max-age=(\d+)/i.exec(hsts || '')?.[1] || 0);
  items.push({ id: 'hsts', name: 'Strict-Transport-Security', weight: 20,
    status: u.protocol !== 'https:' ? 'fail' : !hsts ? 'fail' : maxAge >= 15552000 ? 'pass' : 'warn', value: hsts,
    adviceAr: !hsts ? 'فعّل HSTS بقيمة max-age لا تقل عن 6 أشهر مع includeSubDomains.' : 'تأكد أن المدة ≥ 180 يومًا.' });

  const xfo = get('x-frame-options');
  const fa = /frame-ancestors/i.test(csp || '');
  items.push({ id: 'frame', name: 'X-Frame-Options / frame-ancestors', weight: 10, status: xfo || fa ? 'pass' : 'fail', value: xfo || (fa ? 'via CSP frame-ancestors' : null), adviceAr: 'امنع تضمين موقعك في إطارات (Clickjacking).' });

  const xcto = get('x-content-type-options');
  items.push({ id: 'xcto', name: 'X-Content-Type-Options', weight: 10, status: xcto?.toLowerCase() === 'nosniff' ? 'pass' : 'fail', value: xcto, adviceAr: 'القيمة الصحيحة: nosniff.' });

  const rp = get('referrer-policy');
  items.push({ id: 'referrer', name: 'Referrer-Policy', weight: 10, status: !rp ? 'warn' : /unsafe-url|no-referrer-when-downgrade/.test(rp) ? 'warn' : 'pass', value: rp, adviceAr: 'يوصى بـ strict-origin-when-cross-origin.' });

  const pp = get('permissions-policy');
  items.push({ id: 'permissions', name: 'Permissions-Policy', weight: 5, status: pp ? 'pass' : 'warn', value: pp, adviceAr: 'عطّل الميزات غير المستخدمة (camera, microphone, geolocation).' });

  const coop = get('cross-origin-opener-policy');
  items.push({ id: 'coop', name: 'Cross-Origin-Opener-Policy', weight: 5, status: coop ? 'pass' : 'warn', value: coop, adviceAr: 'يوصى بـ same-origin للعزل بين النوافذ.' });

  const server = get('server'); const xpb = get('x-powered-by');
  const leaks = (server && /\d/.test(server)) || !!xpb;
  items.push({ id: 'leak', name: 'إفصاح عن إصدار الخادم', weight: 5, status: leaks ? 'warn' : 'pass', value: [server, xpb].filter(Boolean).join(' | ') || null, adviceAr: 'أخفِ أرقام الإصدارات وترويسة X-Powered-By.' });

  const cookies = (h as any).getSetCookie ? (h as any).getSetCookie() as string[] : [];
  const weak = cookies.filter(c => !/;\s*secure/i.test(c) || !/;\s*httponly/i.test(c) || !/;\s*samesite/i.test(c));
  items.push({ id: 'cookies', name: 'خصائص ملفات الكوكيز', weight: 10, status: !cookies.length ? 'pass' : weak.length ? 'fail' : 'pass', value: cookies.length ? `${cookies.length} كوكي، ${weak.length} بدون Secure/HttpOnly/SameSite كاملة` : 'لا كوكيز في الاستجابة', adviceAr: 'كل كوكي جلسة يجب أن يحمل Secure وHttpOnly وSameSite.' });

  const total = items.reduce((a, i) => a + i.weight, 0);
  const got = items.reduce((a, i) => a + (i.status === 'pass' ? i.weight : i.status === 'warn' ? i.weight * 0.5 : 0), 0);
  const pct = Math.round((got / total) * 100);
  const grade = pct >= 95 ? 'A+' : pct >= 85 ? 'A' : pct >= 70 ? 'B' : pct >= 55 ? 'C' : pct >= 40 ? 'D' : 'F';
  return { url: u.toString(), finalUrl: r.finalUrl, httpStatus: r.status, grade, percent: pct, items, checkedAt: new Date().toISOString() };
}
