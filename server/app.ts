import express, { type Request, type Response, type NextFunction } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { scanUrl } from './threat/url.js';
import { checkEmailBreach } from './threat/breach.js';
import { analyzePhone } from './threat/phone.js';
import { analyzeIp } from './threat/ip.js';
import { auditHeaders } from './threat/headers.js';
import { analyzeSocial } from './threat/social.js';
import { analyzeMessage } from './threat/message.js';

dotenv.config();

export const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

// ترويسات أمان أساسية
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// تحديد المعدل (بالذاكرة) لحماية الخادم ومفاتيح API من الإساءة
const buckets = new Map<string, { n: number; reset: number }>();
function rateLimit(max: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const b = buckets.get(key);
    if (!b || now > b.reset) { buckets.set(key, { n: 1, reset: now + windowMs }); return next(); }
    if (++b.n > max) return res.status(429).json({ error: 'RATE_LIMITED', message: 'طلبات كثيرة. حاول بعد قليل.' });
    next();
  };
}
setInterval(() => { const now = Date.now(); for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k); }, 60_000).unref();

const wrap = (fn: (body: any) => Promise<unknown>) => async (req: Request, res: Response) => {
  try { res.json(await fn(req.body || {})); }
  catch (e: any) {
    const m = String(e?.message || '');
    if (['INVALID_INPUT', 'UNSUPPORTED_PROTOCOL', 'INVALID_HOST'].includes(m) || e instanceof TypeError)
      return res.status(400).json({ error: 'INVALID_INPUT', message: 'المدخل غير صالح.' });
    console.error('scan error:', m);
    res.status(500).json({ error: 'SCAN_FAILED', message: 'تعذّر إتمام الفحص.' });
  }
};

const scanLimit = rateLimit(20, 10 * 60_000);
app.post('/api/scan/url', scanLimit, wrap(b => scanUrl(String(b.url || ''))));
app.post('/api/scan/headers', scanLimit, wrap(b => auditHeaders(String(b.url || ''))));
app.post('/api/scan/email', rateLimit(8, 10 * 60_000), wrap(b => checkEmailBreach(String(b.email || ''))));
app.post('/api/scan/phone', scanLimit, wrap(b => analyzePhone(String(b.phone || ''), b.country ? String(b.country) : undefined)));
app.post('/api/scan/ip', scanLimit, wrap(b => analyzeIp(String(b.ip || ''))));
app.post('/api/scan/social', scanLimit, wrap(async b => analyzeSocial(String(b.handle || ''))));
// فاحص الرسائل المشبوهة: تحليل محلي بلا شبكة ولا قواعد بيانات خارجية
app.post('/api/scan/message', scanLimit, wrap(async b => analyzeMessage(String(b.text || ''))));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    sources: {
      googleSafeBrowsing: !!process.env.GSB_API_KEY, virusTotal: !!process.env.VT_API_KEY, urlhaus: !!process.env.URLHAUS_AUTH_KEY,
      hibp: !!process.env.HIBP_API_KEY, abuseipdb: !!process.env.ABUSEIPDB_KEY, twilioLookup: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      gemini: !!process.env.GEMINI_API_KEY,
    },
  });
});

// المرشد السيبراني (Gemini من جهة الخادم)
app.post('/api/ai-mentor', rateLimit(30, 10 * 60_000), async (req, res) => {
  try {
    const prompt = String(req.body?.prompt || '').slice(0, 2000);
    const mode = String(req.body?.mode || 'explain');
    const context = req.body?.context ? JSON.stringify(req.body.context).slice(0, 1500) : '';
    const apiKey = process.env.GEMINI_API_KEY;
    if (!prompt) return res.status(400).json({ error: 'INVALID_INPUT' });
    if (!apiKey) return res.json({ reply: null, reason: 'no_key' });

    const style: Record<string, string> = {
      hint: 'قدّم تلميحات متدرجة دون كشف الحل أو الراية.',
      error: 'حلل رسالة الخطأ أو مخرجات الطرفية واشرح سببها وكيفية إصلاحها.',
      report_review: 'راجع مسودة التقرير ونبّه على ضعف الأدلة والمخاطر غير الواقعية واقترح تحسينات.',
      explain: 'اشرح المفهوم بأسلوب تطبيقي يربط النظرية بالمختبر.',
    };
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
      config: {
        systemInstruction:
          'أنت «مرشد كايا السيبراني» في أكاديمية KAyA SafeSec. أجب بالعربية المهنية مع إبقاء المصطلحات التقنية بالإنجليزية. ' +
          'ركّز على الدفاع والتعلّم الأخلاقي. ارفض بأدب أي طلب لاستهداف أنظمة أو أشخاص حقيقيين دون تفويض، ولا تقدّم برمجيات خبيثة جاهزة. ' +
          (style[mode] || style.explain) + (context ? `\nالسياق: ${context}` : ''),
      },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    res.json({ reply: response.text ?? null });
  } catch (e: any) {
    console.error('AI Mentor Error:', e?.message);
    res.json({ reply: null, reason: 'upstream_error' });
  }
});
