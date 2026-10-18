import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import dns from 'dns';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// API route for Educational AI Assistant (KAyA Cyber Mentor)
app.post('/api/ai-mentor', async (req, res) => {
  try {
    const { prompt, mode, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return null so client falls back gracefully to built-in knowledge engine
      return res.status(200).json({ reply: null });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `أنت "مرشد كايا السيبراني" (KAyA Cyber Mentor)، مستشار وخبير تعليمي متخصص في الأمن السيبراني والتحقيق الجنائي الرقمي بأكاديمية KAyA SafeSec.
مهمتك:
- الإجابة باللغة العربية الفصحى السليمة والمهنية مع دعم المصطلحات الإنجليزية الفنية الدقيقة.
- نمط الشرح: ${
      mode === 'hint'
        ? 'قدّم تلميحات متدرجة ذكية خطوة بخطوة دون إعطاء الحل المباشر أو كشف الراية مباشرة.'
        : mode === 'error'
        ? 'حلل رسالة الخطأ أو مخرجات الطرفية بدقة واشرح سببها الجذري وكيفية تصحيحها.'
        : mode === 'report_review'
        ? 'راجع مسودة التقرير، تحقق من واقعية المخاطر واقترح تحسينات هندسية واضحة.'
        : 'اشرح المفهوم بأسلوب هندسي تطبيقي يربط بين النظرية والتطبيق في المختبر.'
    }
السياق الحالي: ${context ? JSON.stringify(context) : 'منصة KAyA SafeSec للأمن السيبراني'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nسؤال الطالب: ${prompt}` }] }
      ]
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('AI Mentor Error:', error);
    res.status(200).json({ reply: null });
  }
});

// REAL Security URL Scanner & Header Auditor Route
app.post('/api/security/scan-url', async (req, res) => {
  try {
    let rawUrl = String(req.body.url || '').trim();
    if (!rawUrl) return res.status(400).json({ error: 'URL is required' });

    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }

    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL structure' });
    }

    const hostname = parsed.hostname;
    const sha256 = crypto.createHash('sha256').update(rawUrl).digest('hex');

    // 1. Real DNS Resolution
    const startTime = Date.now();
    const [aRecords, mxRecords, txtRecords] = await Promise.all([
      dns.promises.resolve4(hostname).catch(() => []),
      dns.promises.resolveMx(hostname).catch(() => []),
      dns.promises.resolveTxt(hostname).catch(() => [])
    ]);

    // 2. Real HTTP fetch to inspect live response & headers
    let httpStatus = 0;
    const responseHeaders: Record<string, string> = {};
    let latencyMs = 0;
    let finalUrl = rawUrl;
    let fetchError: string | null = null;

    try {
      const fetchStart = Date.now();
      const response = await fetch(rawUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (compatible; KAyASecurityScanner/2.0)'
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(6000)
      });
      latencyMs = Date.now() - fetchStart;
      httpStatus = response.status;
      finalUrl = response.url;
      response.headers.forEach((value, key) => {
        responseHeaders[key.toLowerCase()] = value;
      });
    } catch (err: any) {
      fetchError = err.message || 'Connection timeout or blocked';
      latencyMs = Date.now() - startTime;
    }

    // 3. True Security Headers Audit
    const csp = responseHeaders['content-security-policy'] || null;
    const hsts = responseHeaders['strict-transport-security'] || null;
    const xfo = responseHeaders['x-frame-options'] || null;
    const xcto = responseHeaders['x-content-type-options'] || null;
    const refPol = responseHeaders['referrer-policy'] || null;
    const permPol = responseHeaders['permissions-policy'] || null;
    const serverHeader = responseHeaders['server'] || null;

    let score = 100;
    if (!csp) score -= 25;
    if (!hsts) score -= 20;
    if (!xfo) score -= 15;
    if (!xcto) score -= 15;
    if (!refPol) score -= 10;
    if (!permPol) score -= 10;
    if (serverHeader) score -= 5;
    score = Math.max(0, score);

    let grade = 'F';
    if (score >= 90) grade = 'A+';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 55) grade = 'C';
    else if (score >= 40) grade = 'D';

    res.json({
      url: rawUrl,
      hostname,
      finalUrl,
      httpStatus,
      latencyMs,
      fetchError,
      isReachable: httpStatus > 0,
      dns: {
        ipAddresses: aRecords,
        mxRecords: mxRecords.map(m => m.exchange),
        hasTxtSpf: txtRecords.some(t => t.join(' ').toLowerCase().includes('v=spf1'))
      },
      headers: {
        csp,
        hsts,
        xfo,
        xcto,
        refPol,
        permPol,
        server: serverHeader,
        raw: responseHeaders
      },
      audit: {
        score,
        grade
      },
      virustotal: {
        sha256,
        reportUrl: `https://www.virustotal.com/gui/url/${sha256}`
      }
    });
  } catch (err: any) {
    console.error('Scan URL Error:', err);
    res.status(500).json({ error: 'Failed to scan URL: ' + (err.message || 'Unknown error') });
  }
});

// REAL IP Intelligence Route
app.get('/api/security/ip-intel', async (req, res) => {
  try {
    const ip = String(req.query.ip || '').trim();
    if (!ip) return res.status(400).json({ error: 'IP address is required' });

    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(6000)
    });
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    console.error('IP Intel Error:', err);
    res.status(500).json({ error: 'Failed to query IP intelligence' });
  }
});

async function startServer() {
  app.use(express.static('public'));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
