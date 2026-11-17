import type { Indicator } from './types.js';

const PLATFORMS: Record<string, { name: string; hosts: string[]; verify: string[] }> = {
  instagram: { name: 'Instagram', hosts: ['instagram.com'], verify: ['الشارة الزرقاء وحدها لا تكفي: افتح الحساب من التطبيق الرسمي للعلامة التجارية.', 'قارن عدد المنشورات وتاريخ أول منشور وتفاعل المتابعين الحقيقي.', 'تحقق أن رابط الموقع في الوصف يطابق موقع الجهة الرسمي المعروف لديك.'] },
  x: { name: 'X (Twitter)', hosts: ['x.com', 'twitter.com'], verify: ['اضغط على «تاريخ الانضمام» في الملف: الحسابات الرسمية الكبيرة نادرًا ما تكون حديثة.', 'ابحث عن الحساب من الموقع الرسمي للجهة (رابط الحسابات الرسمية في تذييل الموقع).', 'الحسابات الموثّقة مدفوعة الآن؛ الشارة لا تثبت أنه حساب رسمي.'] },
  facebook: { name: 'Facebook', hosts: ['facebook.com', 'fb.com'], verify: ['افتح «شفافية الصفحة» لترى تاريخ الإنشاء وتغييرات الاسم.', 'تحقق من الموقع الرسمي للجهة للوصول إلى صفحتها.'] },
  tiktok: { name: 'TikTok', hosts: ['tiktok.com'], verify: ['تحقق من الموقع الرسمي للجهة للوصول إلى حسابها.', 'احذر الحسابات التي تطلب الانتقال لتطبيق مراسلة خاص.'] },
  telegram: { name: 'Telegram', hosts: ['t.me', 'telegram.me'], verify: ['لا يملك أي موظف دعم رسمي حسابًا يبدأ محادثة معك أولًا.', 'قنوات الجهات الرسمية تُنشر روابطها في مواقعها.'] },
  whatsapp: { name: 'WhatsApp', hosts: ['wa.me', 'whatsapp.com'], verify: ['أرقام الأعمال الرسمية موثّقة بشارة خضراء وتُنشر على موقع الجهة.'] },
  snapchat: { name: 'Snapchat', hosts: ['snapchat.com'], verify: ['تحقق من الحساب عبر الموقع الرسمي للجهة.'] },
  linkedin: { name: 'LinkedIn', hosts: ['linkedin.com'], verify: ['تحقق من عدد الموظفين المرتبطين بالصفحة وتاريخ الإنشاء.'] },
  unknown: { name: 'غير محدد', hosts: [], verify: ['اعثر على الحساب الرسمي من الموقع الرسمي للجهة، لا من نتائج البحث أو رسائل واردة.'] },
};
const BRANDS = ['google','microsoft','apple','paypal','amazon','netflix','facebook','instagram','whatsapp','telegram','tiktok','snapchat','binance','coinbase','stc','alrajhi','snb','alahli','emiratesnbd','careem','noon','aramex','dhl','fedex','absher','nafath','tawakkalna'];
const SCAM_WORDS = ['support','helpdesk','help','official','verify','verified','giveaway','airdrop','claim','recovery','admin','team','service','care','refund','winner','prize','promo'];

const lev = (a: string, b: string) => { const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]); for (let j = 0; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1]+(a[i-1]===b[j-1]?0:1)); return d[a.length][b.length]; };

export function analyzeSocial(raw: string) {
  const input = (raw || '').trim();
  if (!input || input.length > 300) throw new Error('INVALID_INPUT');
  let platformKey = 'unknown'; let handle = input.replace(/^@/, '');
  try {
    const u = new URL(/^https?:\/\//i.test(input) ? input : 'https://' + input);
    const host = u.hostname.replace(/^www\./, '');
    for (const [k, p] of Object.entries(PLATFORMS)) if (p.hosts.some(h => host === h || host.endsWith('.' + h))) platformKey = k;
    if (platformKey !== 'unknown') handle = (u.pathname.split('/').filter(Boolean)[0] || '').replace(/^@/, '');
  } catch {}
  handle = handle.toLowerCase();
  const clean = handle.replace(/[._-]/g, '');
  const deleet = clean.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/5/g, 's').replace(/4/g, 'a');

  const ind: Indicator[] = [];
  for (const b of BRANDS) {
    if (deleet === b) continue;
    if ((deleet.includes(b) && b.length >= 4) || (b.length >= 5 && lev(deleet, b) <= 1)) { ind.push({ id: 'brand', severity: 'high', titleAr: `الاسم يحاكي علامة «${b}»`, detailAr: 'الحسابات الرسمية لا تحتاج عادةً إلى إضافات مثل support/official/ورموز مبدلة.' }); break; }
  }
  const words = SCAM_WORDS.filter(w => clean.includes(w));
  if (words.length) ind.push({ id: 'words', severity: words.length > 1 ? 'high' : 'medium', titleAr: `كلمات انتحال شائعة (${words.slice(0, 3).join('، ')})`, detailAr: 'تُستخدم لإيهامك أنه حساب دعم أو جهة رسمية.' });
  if (/\d{4,}$/.test(handle)) ind.push({ id: 'digits', severity: 'low', titleAr: 'أرقام طويلة في آخر الاسم', detailAr: 'نمط شائع في الحسابات المنشأة آليًا.' });
  if (/[_.]{2,}|^[_.]|[_.]$/.test(handle)) ind.push({ id: 'punct', severity: 'low', titleAr: 'تكرار رموز في الاسم', detailAr: 'يُستخدم لتمييز نسخة مزيفة عن الأصلية.' });
  if (/[^\x00-\x7F]/.test(handle)) ind.push({ id: 'unicode', severity: 'medium', titleAr: 'أحرف غير لاتينية في الاسم', detailAr: 'قد تكون أحرفًا مشابهة بصريًا (Homoglyph).' });
  if (!handle) ind.push({ id: 'nohandle', severity: 'info', titleAr: 'لم يُستخرج اسم مستخدم', detailAr: 'أدخل الرابط الكامل للحساب أو اسم المستخدم.' });

  const highs = ind.filter(i => i.severity === 'high').length;
  const level = highs ? 'high' : ind.some(i => i.severity === 'medium') ? 'medium' : 'low';
  return {
    platform: PLATFORMS[platformKey].name, handle, riskLevel: level, indicators: ind,
    verificationSteps: PLATFORMS[platformKey].verify,
    limitations: 'لا يمكن لأي أداة خارجية قراءة عدد المتابعين أو عمر الحساب بدقة دون إذن المنصات. هذا التحليل يفحص الاسم والنمط فقط، ولا يُثبت أصالة الحساب. استخدم خطوات التحقق اليدوية أدناه.',
    checkedAt: new Date().toISOString(),
  };
}
