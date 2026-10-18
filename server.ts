import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

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
