import dns from 'node:dns/promises';
import tls from 'node:tls';
import net from 'node:net';
import { parse as parseDomain } from 'tldts';
import { guardedFetch, isPrivateIp, daysBetween } from './netguard.js';
import type { Indicator, SourceResult, Verdict } from './types.js';

const BRANDS = [
  'google','gmail','microsoft','outlook','office365','apple','icloud','paypal','amazon','netflix','facebook','instagram',
  'whatsapp','telegram','tiktok','snapchat','twitter','linkedin','binance','coinbase','metamask','dhl','fedex','aramex',
  'stcpay','alrajhi','alrajhibank','snb','alahli','riyadbank','emiratesnbd','adcb','fab','mashreq','qnb','nbk','absher',
  'tawakkalna','nafath','uae','careem','noon','talabat','github','dropbox','zoom','steam','roblox'
];
const SHORTENERS = new Set(['bit.ly','tinyurl.com','t.co','goo.gl','is.gd','cutt.ly','rb.gy','ow.ly','buff.ly','shorturl.at','tiny.cc','s.id','t.ly','rebrand.ly']);
const RISKY_TLDS = new Set(['zip','mov','xyz','top','click','live','icu','cyou','rest','buzz','gq','tk','ml','cf','ga','work','support','country','kim','loan']);
const LURE_WORDS = ['login','signin','verify','secure','account','update','confirm','wallet','recovery','suspend','unlock','billing','password','invoice','claim','prize','gift','refund'];

const HOMO: Record<string, string> = { '0':'o','1':'l','3':'e','4':'a','5':'s','7':'t','8':'b','$':'s','@':'a','і':'i','о':'o','а':'a','е':'e','р':'p','с':'c','ѕ':'s' };
function deLeet(s: string) { return s.split('').map(c => HOMO[c] ?? c).join(''); }
function lev(a: string, b: string) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return d[m][n];
}

export function normalizeUrl(raw: string): URL {
  let s = (raw || '').trim();
  if (!s || s.length > 2048) throw new Error('INVALID_INPUT');
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = 'https://' + s;
  const u = new URL(s);
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('UNSUPPORTED_PROTOCOL');
  if (!u.hostname.includes('.') && !net.isIP(u.hostname) && !u.hostname.startsWith('[')) throw new Error('INVALID_HOST');
  return u;
}

export function localIndicators(u: URL): Indicator[] {
  const out: Indicator[] = [];
  const host = u.hostname.toLowerCase();
  const info = parseDomain(host);
  const sld = (info.domainWithoutSuffix || '').toLowerCase();
  const tld = (info.publicSuffix || '').split('.').pop() || '';
  const subs = info.subdomain ? info.subdomain.split('.') : [];

  if (net.isIP(host)) out.push({ id: 'ip_host', severity: 'high', titleAr: 'عنوان IP بدل اسم نطاق', detailAr: 'المواقع الشرعية نادرًا ما تطلب منك فتح عنوان رقمي مباشر.' });
  if (u.username || u.password) out.push({ id: 'userinfo', severity: 'high', titleAr: 'بيانات اعتماد داخل الرابط (@)', detailAr: 'الجزء قبل علامة @ يُستخدم لإيهامك أن الرابط يخص موقعًا آخر، والوجهة الفعلية هي ما بعدها.' });
  if (host.includes('xn--')) out.push({ id: 'punycode', severity: 'high', titleAr: 'نطاق بترميز Punycode', detailAr: 'قد يحتوي أحرفًا مشابهة بصريًا لأحرف لاتينية لانتحال علامة تجارية.' });
  if (SHORTENERS.has(host)) out.push({ id: 'shortener', severity: 'medium', titleAr: 'رابط مختصر', detailAr: 'الوجهة النهائية مخفية، وتم تتبّعها أدناه في سلسلة التحويلات.' });
  if (RISKY_TLDS.has(tld)) out.push({ id: 'risky_tld', severity: 'low', titleAr: `امتداد .${tld} كثير الإساءة`, detailAr: 'هذه الامتدادات رخيصة أو مجانية وتُستغل كثيرًا، لكنها لا تعني وحدها أن الموقع خبيث.' });
  if (subs.length >= 3) out.push({ id: 'deep_sub', severity: 'medium', titleAr: 'نطاقات فرعية متعددة', detailAr: 'تُستخدم لإخفاء النطاق الحقيقي خصوصًا على شاشات الجوال.' });
  if (u.port && !['80', '443'].includes(u.port)) out.push({ id: 'port', severity: 'low', titleAr: `منفذ غير قياسي (${u.port})`, detailAr: 'مواقع الخدمات العامة تستخدم عادةً 80 أو 443.' });
  if (u.protocol === 'http:') out.push({ id: 'http', severity: 'medium', titleAr: 'اتصال غير مشفر (HTTP)', detailAr: 'يمكن اعتراض أو تعديل ما تُدخله في الصفحة.' });
  if (u.href.length > 200) out.push({ id: 'long', severity: 'low', titleAr: 'رابط طويل جدًا', detailAr: 'قد يخفي معاملات تتبع أو توجيه.' });

  // انتحال علامة تجارية: اسم النطاق يشبه علامة معروفة دون أن يكون النطاق الرسمي نفسه
  const flat = deLeet(sld.replace(/[-_]/g, ''));
  for (const b of BRANDS) {
    const exactRoot = sld === b;
    if (exactRoot) break;
    const contained = flat.includes(b) && flat !== b && b.length >= 5;
    const near = b.length >= 5 && lev(flat, b) <= 1 && flat !== b;
    const inSub = subs.some(s => deLeet(s).includes(b)) && sld !== b;
    if (contained || near || inSub) {
      out.push({ id: 'brand_' + b, severity: 'high', titleAr: `يشبه علامة «${b}» وليس نطاقها الرسمي`, detailAr: `النطاق المسجّل هو «${info.domain}». تحقق أن هذا هو العنوان الرسمي فعلًا قبل إدخال أي بيانات.` });
      break;
    }
  }
  const lures = LURE_WORDS.filter(w => (host + u.pathname).toLowerCase().includes(w));
  if (lures.length >= 2) out.push({ id: 'lures', severity: 'medium', titleAr: 'كلمات استدراج متعددة', detailAr: `وجود: ${lures.slice(0, 4).join('، ')} معًا في الرابط نمط شائع في صفحات التصيد.` });
  return out;
}

async function dnsInfo(host: string) {
  const r: any = { a: [], aaaa: [], ns: [], mx: [], privateResolution: false };
  const safe = async <T,>(p: Promise<T>, d: T) => { try { return await p; } catch { return d; } };
  if (net.isIP(host)) { r.a = [host]; r.privateResolution = isPrivateIp(host); return r; }
  const info = parseDomain(host);
  const apex = info.domain || host;
  [r.a, r.aaaa, r.ns, r.mx] = await Promise.all([
    safe(dns.resolve4(host), [] as string[]),
    safe(dns.resolve6(host), [] as string[]),
    safe(dns.resolveNs(apex), [] as string[]),
    safe(dns.resolveMx(apex).then(m => m.map(x => x.exchange).filter(Boolean)), [] as string[]),
  ]);
  r.privateResolution = [...r.a, ...r.aaaa].some(isPrivateIp);
  return r;
}

function tlsInfo(host: string, ip?: string): Promise<any> {
  return new Promise((resolve) => {
    if (net.isIP(host) || (ip && isPrivateIp(ip))) return resolve(null);
    const sock = tls.connect({ host: ip || host, port: 443, servername: host, rejectUnauthorized: false, timeout: 6000 }, () => {
      const c: any = sock.getPeerCertificate();
      const out = c && c.valid_to ? {
        authorized: sock.authorized,
        authError: sock.authorizationError ? String(sock.authorizationError) : null,
        protocol: sock.getProtocol(),
        issuer: c.issuer?.O || c.issuer?.CN || null,
        subject: c.subject?.CN || null,
        validFrom: new Date(c.valid_from).toISOString(),
        validTo: new Date(c.valid_to).toISOString(),
        daysRemaining: daysBetween(new Date(), new Date(c.valid_to)),
        ageDays: daysBetween(new Date(c.valid_from), new Date()),
      } : null;
      sock.end(); resolve(out);
    });
    sock.on('error', () => resolve(null));
    sock.on('timeout', () => { sock.destroy(); resolve(null); });
  });
}

async function domainAge(host: string) {
  const apex = parseDomain(host).domain;
  if (!apex || net.isIP(host)) return null;
  try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(apex)}`, { signal: ctrl.signal, headers: { Accept: 'application/rdap+json' } });
    clearTimeout(t);
    if (!res.ok) return null;
    const j: any = await res.json();
    const ev = (j.events || []).find((e: any) => e.eventAction === 'registration');
    if (!ev?.eventDate) return null;
    const created = new Date(ev.eventDate);
    return { apex, createdAt: created.toISOString(), ageDays: daysBetween(created, new Date()) };
  } catch { return null; }
}

// ===== مصادر السمعة =====
let openphishCache: { t: number; set: Set<string>; hosts: Set<string> } | null = null;
async function openPhish(url: string, host: string): Promise<SourceResult> {
  const base = { id: 'openphish', name: 'OpenPhish (قائمة مجتمعية)' };
  try {
    if (!openphishCache || Date.now() - openphishCache.t > 3600_000) {
      const res = await fetch('https://openphish.com/feed.txt', { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error('feed');
      const lines = (await res.text()).split('\n').map(s => s.trim()).filter(Boolean);
      openphishCache = { t: Date.now(), set: new Set(lines), hosts: new Set(lines.map(l => { try { return new URL(l).hostname; } catch { return ''; } })) };
    }
    const hit = openphishCache.set.has(url) || openphishCache.hosts.has(host);
    return { ...base, status: 'ok', flagged: hit, detail: hit ? 'مدرج في قائمة التصيد النشطة' : 'غير مدرج' };
  } catch { return { ...base, status: 'unavailable', detail: 'تعذّر جلب القائمة' }; }
}

async function safeBrowsing(url: string): Promise<SourceResult> {
  const base = { id: 'gsb', name: 'Google Safe Browsing' };
  const key = process.env.GSB_API_KEY;
  if (!key) return { ...base, status: 'not_configured', detail: 'مفتاح GSB_API_KEY غير مضبوط' };
  try {
    const res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        client: { clientId: 'kaya-safesec', clientVersion: '2.0' },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'], threatEntryTypes: ['URL'], threatEntries: [{ url }],
        },
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const j: any = await res.json();
    const m = j.matches?.[0];
    return { ...base, status: 'ok', flagged: !!m, detail: m ? `مصنّف: ${m.threatType}` : 'لا توجد تطابقات' };
  } catch { return { ...base, status: 'unavailable', detail: 'فشل الاتصال بالخدمة' }; }
}

async function virusTotal(url: string): Promise<SourceResult> {
  const base = { id: 'virustotal', name: 'VirusTotal' };
  const key = process.env.VT_API_KEY;
  if (!key) return { ...base, status: 'not_configured', detail: 'مفتاح VT_API_KEY غير مضبوط' };
  const id = Buffer.from(url).toString('base64url').replace(/=+$/, '');
  const h = { 'x-apikey': key };
  try {
    let res = await fetch(`https://www.virustotal.com/api/v3/urls/${id}`, { headers: h, signal: AbortSignal.timeout(8000) });
    if (res.status === 404) {
      const sub = await fetch('https://www.virustotal.com/api/v3/urls', { method: 'POST', headers: { ...h, 'content-type': 'application/x-www-form-urlencoded' }, body: `url=${encodeURIComponent(url)}`, signal: AbortSignal.timeout(8000) });
      if (!sub.ok) throw new Error('submit');
      await new Promise(r => setTimeout(r, 4000));
      res = await fetch(`https://www.virustotal.com/api/v3/urls/${id}`, { headers: h, signal: AbortSignal.timeout(8000) });
    }
    if (!res.ok) throw new Error(String(res.status));
    const j: any = await res.json();
    const s = j.data?.attributes?.last_analysis_stats;
    if (!s) return { ...base, status: 'ok', flagged: false, detail: 'التحليل قيد المعالجة' };
    const total = Object.values(s).reduce((a: number, b: any) => a + Number(b), 0);
    const mal = Number(s.malicious || 0), sus = Number(s.suspicious || 0);
    return { ...base, status: 'ok', flagged: mal >= 2, detail: `${mal} ضار، ${sus} مشبوه من أصل ${total} محرك`, link: `https://www.virustotal.com/gui/url/${id}` };
  } catch { return { ...base, status: 'unavailable', detail: 'فشل الاتصال أو تجاوز الحصة' }; }
}

async function urlhaus(url: string): Promise<SourceResult> {
  const base = { id: 'urlhaus', name: 'URLhaus (abuse.ch)' };
  const key = process.env.URLHAUS_AUTH_KEY;
  if (!key) return { ...base, status: 'not_configured', detail: 'مفتاح URLHAUS_AUTH_KEY غير مضبوط' };
  try {
    const res = await fetch('https://urlhaus-api.abuse.ch/v1/url/', { method: 'POST', headers: { 'Auth-Key': key, 'content-type': 'application/x-www-form-urlencoded' }, body: `url=${encodeURIComponent(url)}`, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(String(res.status));
    const j: any = await res.json();
    const hit = j.query_status === 'ok';
    return { ...base, status: 'ok', flagged: hit, detail: hit ? `موزّع برمجيات خبيثة (${j.threat || 'malware'})` : 'غير مدرج' };
  } catch { return { ...base, status: 'unavailable', detail: 'فشل الاتصال' }; }
}

export async function scanUrl(raw: string) {
  const u = normalizeUrl(raw);
  const host = u.hostname.toLowerCase();
  const indicators = localIndicators(u);

  const dnsR = await dnsInfo(host);
  if (dnsR.privateResolution) {
    return { blocked: true, reason: 'النطاق يشير إلى عنوان داخلي/خاص ولا يمكن فحصه.' };
  }

  let redirect: any = null;
  try {
    const r = await guardedFetch(u.toString(), { method: 'GET', timeoutMs: 8000 });
    redirect = { hops: r.hops, finalUrl: r.finalUrl, status: r.status };
    const finalHost = new URL(r.finalUrl).hostname;
    if (finalHost !== host) {
      const fi = localIndicators(new URL(r.finalUrl)).filter(i => i.severity !== 'info');
      indicators.push({ id: 'redirect_other_host', severity: 'medium', titleAr: 'يعيد التوجيه إلى نطاق مختلف', detailAr: `الوجهة النهائية: ${finalHost}` });
      for (const i of fi) if (!indicators.find(x => x.id === i.id)) indicators.push({ ...i, titleAr: '(الوجهة النهائية) ' + i.titleAr });
    }
    if (r.hops.length > 3) indicators.push({ id: 'many_redirects', severity: 'medium', titleAr: `سلسلة تحويلات طويلة (${r.hops.length})`, detailAr: 'تُستخدم لتجاوز الفلاتر.' });
  } catch (e: any) {
    redirect = { error: e?.message === 'BLOCKED_PRIVATE_ADDRESS' ? 'محظور' : 'تعذّر الوصول إلى الموقع' };
  }

  const [tlsR, age, ...sources] = await Promise.all([
    u.protocol === 'https:' ? tlsInfo(host, dnsR.a[0]) : Promise.resolve(null),
    domainAge(host),
    safeBrowsing(u.toString()),
    virusTotal(u.toString()),
    urlhaus(u.toString()),
    openPhish(u.toString(), host),
  ]);

  if (age && age.ageDays < 30) indicators.push({ id: 'new_domain', severity: age.ageDays < 7 ? 'high' : 'medium', titleAr: `نطاق حديث جدًا (${age.ageDays} يومًا)`, detailAr: 'معظم حملات التصيد تستخدم نطاقات عمرها أيام.' });
  if (tlsR && !tlsR.authorized) indicators.push({ id: 'bad_cert', severity: 'high', titleAr: 'شهادة TLS غير موثوقة', detailAr: tlsR.authError || 'فشل التحقق من الشهادة.' });
  if (tlsR && tlsR.daysRemaining < 0) indicators.push({ id: 'expired_cert', severity: 'high', titleAr: 'شهادة منتهية', detailAr: 'انتهت صلاحية الشهادة.' });
  if (!dnsR.a.length && !dnsR.aaaa.length && !net.isIP(host)) indicators.push({ id: 'nxdomain', severity: 'info', titleAr: 'النطاق لا يُحَل إلى عنوان', detailAr: 'قد يكون محذوفًا أو معطّلًا.' });

  const okSources = (sources as SourceResult[]).filter(s => s.status === 'ok');
  const flagged = okSources.filter(s => s.flagged);
  const highs = indicators.filter(i => i.severity === 'high').length;
  const meds = indicators.filter(i => i.severity === 'medium').length;

  let verdict: Verdict;
  if (flagged.length) verdict = 'malicious';
  else if (highs >= 1 && highs + meds >= 2) verdict = 'suspicious';
  else if (okSources.length === 0 && highs + meds === 0) verdict = 'inconclusive';
  else if (highs >= 1) verdict = 'suspicious';
  else verdict = 'no_known_threat';

  return {
    input: raw, normalizedUrl: u.toString(), hostname: host, registrableDomain: parseDomain(host).domain,
    verdict, indicators, sources, dns: dnsR, redirect, tls: tlsR, domainAge: age,
    coverage: { responded: okSources.length, total: sources.length },
    checkedAt: new Date().toISOString(),
  };
}
